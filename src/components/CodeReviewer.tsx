'use client'

import { useState } from 'react'
import { submitCodeForReview } from '@/lib/openrouter'

interface ReviewResult {
  thinking?: string
  review: string
  language?: string
  issues: string[]
  suggestions: string[]
}

export default function CodeReviewer() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const review = await submitCodeForReview(code, language)
      setResult(review)
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
    setLanguage('javascript')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Programming Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="cs">C#</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Code to Review
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-96 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm"><strong>⚠️ Error:</strong> {error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Code Review</h3>
              <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                {result.review}
              </p>
            </div>

            {result.issues && result.issues.length > 0 && (
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-red-400 mb-3">Issues Found</h3>
                <ul className="space-y-2">
                  {result.issues.map((issue, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-300">
                      <span className="text-red-400 flex-shrink-0">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions && result.suggestions.length > 0 && (
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-amber-400 mb-3">Suggestions</h3>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-300">
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
          <div className="p-8 bg-gray-800/50 border border-dashed border-gray-600 rounded-lg text-center">
            <p className="text-gray-400">Submit code to see the AI review here</p>
          </div>
        )}
      </div>
    </div>
  )
}
