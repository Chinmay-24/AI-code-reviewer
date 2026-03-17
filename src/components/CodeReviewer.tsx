'use client'

import { useState } from 'react'
import { submitCodeForReview, AVAILABLE_MODELS } from '@/lib/openrouter'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

interface ReviewResult {
  thinking?: string
  review: string
  language?: string
  issues: string[]
  suggestions: string[]
}

interface HistoryItem {
  id: string
  code: string
  language: string
  result: ReviewResult
  mode: string
  model: string
  timestamp: number
}

type ReviewMode = 'quick' | 'detailed' | 'security'

const REVIEW_MODES: { value: ReviewMode; label: string; description: string }[] = [
  { value: 'quick', label: '⚡ Quick', description: 'Fast review - main issues only' },
  { value: 'detailed', label: '📋 Detailed', description: 'Comprehensive analysis' },
  { value: 'security', label: '🔒 Security', description: 'Focus on vulnerabilities' },
]

export default function CodeReviewer() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [model, setModel] = useState(AVAILABLE_MODELS[0])
  const [mode, setMode] = useState<ReviewMode>('detailed')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const review = await submitCodeForReview(code, language, model, mode)
      setResult(review)

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        code,
        language,
        result: review,
        mode,
        model,
        timestamp: Date.now(),
      }
      setHistory([newItem, ...history.slice(0, 9)])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during review')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setCode('')
    setResult(null)
    setError('')
  }

  const copyToClipboard = () => {
    if (result) {
      const text = `Code Review:\n\n${result.review}\n\nIssues:\n${result.issues.join('\n')}\n\nSuggestions:\n${result.suggestions.join('\n')}`
      navigator.clipboard.writeText(text)
      alert('Review copied to clipboard!')
    }
  }

  const loadFromHistory = (item: HistoryItem) => {
    setCode(item.code)
    setLanguage(item.language)
    setResult(item.result)
    setModel(item.model)
    setMode(item.mode as ReviewMode)
    setShowHistory(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Code Review</h2>
          <p className="text-gray-400 text-sm mt-1">Select review type and submit code</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
        >
          📜 History {history.length > 0 && `(${history.length})`}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Review Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {REVIEW_MODES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={`p-3 rounded-lg transition text-sm font-medium ${
                    mode === m.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {m.label}
                  <p className="text-xs opacity-75 mt-1">{m.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Language & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="cs">C#</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 text-sm focus:outline-none focus:border-blue-500"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m === 'mistral-7b-instruct' ? 'Mistral 7B (Fast)' : m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Code Input */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-80 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Reviewing...
                  </>
                ) : (
                  '✨ Get Review'
                )}
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1 space-y-4">
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">
                <strong>⚠️</strong> {error}
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-3 animate-fadeIn bg-gray-800 rounded-lg border border-gray-700 p-4 max-h-[600px] overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-blue-400">Review Result</h3>
                <button
                  onClick={copyToClipboard}
                  className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                >
                  📋 Copy
                </button>
              </div>

              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {result.review}
                </p>
              </div>

              {result.issues.length > 0 && (
                <div className="pt-3 border-t border-gray-600">
                  <h4 className="font-semibold text-red-400 text-sm mb-2">Issues Found</h4>
                  <ul className="space-y-1">
                    {result.issues.map((issue, idx) => (
                      <li key={idx} className="text-xs text-gray-300 flex gap-2">
                        <span className="text-red-400 flex-shrink-0">×</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div className="pt-3 border-t border-gray-600">
                  <h4 className="font-semibold text-amber-400 text-sm mb-2">Suggestions</h4>
                  <ul className="space-y-1">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-xs text-gray-300 flex gap-2">
                        <span className="text-amber-400 flex-shrink-0">→</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!result && !error && !loading && (
            <div className="p-6 bg-gray-800/50 border border-dashed border-gray-600 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Submit code to see review here</p>
            </div>
          )}
        </div>
      </div>

      {/* History Sidebar */}
      {showHistory && history.length > 0 && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Reviews</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => loadFromHistory(item)}
                className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded transition text-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-xs text-blue-400">
                      {item.language} · {item.mode} · {item.model.split('-')[0]}
                    </p>
                    <p className="text-gray-300 truncate">
                      {item.code.slice(0, 40)}...
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

