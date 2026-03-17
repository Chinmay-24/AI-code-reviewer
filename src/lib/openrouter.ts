interface ReviewResult {
  thinking?: string
  review: string
  language?: string
  issues: string[]
  suggestions: string[]
}

export const AVAILABLE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-3-27b-it:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
]

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY

const REVIEW_PROMPTS: Record<string, string> = {
  quick: 'Provide a brief code review. Focus on major issues only.',
  detailed: 'Provide a comprehensive code review including bugs, style, performance, and best practices.',
  security: 'Perform a security-focused code review. Identify potential vulnerabilities, security risks, and unsafe patterns.',
}

/**
 * Submit code for AI review
 * Tries n8n first (production), falls back to direct OpenRouter (development)
 */
export async function submitCodeForReview(
  code: string,
  language: string,
  model: string = 'google/gemma-3-27b-it:free',
  mode: string = 'detailed'
): Promise<ReviewResult> {
  // Try n8n webhook if available (production)
  if (N8N_WEBHOOK_URL) {
    return submitViaN8nWebhook(code, language, model, mode)
  }

  // Fall back to direct OpenRouter (local development)
  if (OPENROUTER_API_KEY) {
    return submitViaOpenRouter(code, language, model, mode)
  }

  throw new Error(
    'No API configured. Set either NEXT_PUBLIC_N8N_WEBHOOK_URL (production) or NEXT_PUBLIC_OPENROUTER_API_KEY (development)'
  )
}

/**
 * Submit code review via n8n webhook (production)
 */
async function submitViaN8nWebhook(
  code: string,
  language: string,
  model: string,
  mode: string
): Promise<ReviewResult> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        model,
        mode,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`Review request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return parseReviewResponse(data)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to submit code for review')
  }
}

/**
 * Submit code review directly to OpenRouter (development)
 */
async function submitViaOpenRouter(
  code: string,
  language: string,
  model: string,
  mode: string
): Promise<ReviewResult> {
  try {
    const modePrompt = REVIEW_PROMPTS[mode] || REVIEW_PROMPTS['detailed']

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: model || 'google/gemma-3-27b-it:free',
        messages: [
          {
            role: 'system',
            content: `You are an expert code reviewer. ${modePrompt}

Format your response with clear sections:
- A summary paragraph
- ISSUES: (bullet-pointed list of problems)
- SUGGESTIONS: (bullet-pointed list of improvements)

Be concise but thorough.`,
          },
          {
            role: 'user',
            content: `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenRouter error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(`OpenRouter error: ${data.error.message || 'Unknown error'}`)
    }
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error(`OpenRouter returned an empty response. Provider may be overloaded.`)
    }
    
    const message = data.choices[0].message || data.choices[0].delta || {}
    if (data.choices[0].error) {
        throw new Error(`Provider error: ${data.choices[0].error}`)
    }

    return parseReviewResponse(message)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to get AI review from OpenRouter')
  }
}

/**
 * Parse AI response and structure the review
 */
function parseReviewResponse(data: any): ReviewResult {
  // Handle different response formats from OpenRouter
  let content = ''

  if (data.content) {
    content = data.content
  } else if (data.result) {
    content = data.result
  } else if (data.message) {
    content = data.message
  } else if (typeof data === 'string') {
    content = data
  } else {
    content = JSON.stringify(data)
  }

  // Extract thinking (if using Claude with extended thinking)
  const thinkingMatch = content.match(/<think>([\s\S]*?)<\/think>/)
  const thinking = thinkingMatch ? thinkingMatch[1].trim() : undefined

  // Remove thinking tags from main content
  const cleanContent = content.replace(/<think>[\s\S]*?<\/think>/, '').trim()

  // Extract sections from the review
  const issues = extractSection(cleanContent, 'issues|problems|bugs')
  const suggestions = extractSection(cleanContent, 'suggestions|improvements|recommendations')

  return {
    thinking,
    review: cleanContent,
    issues: issues.length > 0 ? issues : extractBulletPoints(cleanContent),
    suggestions: suggestions.length > 0 ? suggestions : [],
  }
}

/**
 * Extract a section from the review content
 */
function extractSection(content: string, pattern: string): string[] {
  const regex = new RegExp(`${pattern}[:\\s]*(.*?)(?=(?:^|\\n)[a-z]+[:\\s]|$)`, 'is')
  const match = content.match(regex)

  if (!match) return []

  return extractBulletPoints(match[1])
}

/**
 * Extract bullet points from text
 */
function extractBulletPoints(text: string): string[] {
  if (!text) return []
  const lines = text.split('\n')
  const points: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    // Match lines starting with -, *, •, or a number followed by a period
    if (/^[-*•]|^\d+\./.test(trimmed)) {
      const point = trimmed.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '')
      if (point.length > 0) {
        points.push(point)
      }
    }
  }

  return points
}
