'use client'

import { useState, useEffect } from 'react'
import { submitCodeForReview, AVAILABLE_MODELS } from '@/lib/openrouter'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { exportAsJSON, exportAsMarkdown, exportAsCSV, type ExportData } from '@/lib/export'
import DiffView from './DiffView'
import BatchUpload from './BatchUpload'

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
  { value: 'quick', label: 'Quick', description: 'Fast review - main issues only' },
  { value: 'detailed', label: 'Detailed', description: 'Comprehensive analysis' },
  { value: 'security', label: 'Security', description: 'Focus on vulnerabilities' },
]

const CODE_TEMPLATES: Record<string, string> = {
  javascript: `// Example: Function to calculate factorial
function factorial(n) {
  if (n < 0) return -1;
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

const result = factorial(5);
console.log(result);`,

  typescript: `interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): User | null {
  // TODO: Fetch from database
  return null;
}`,

  python: `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

data = [1, 2, 3, 4, 5]
avg = calculate_average(data)
print(f"Average: {avg}")`,

  java: `public class Calculator {
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        int result = add(5, 3);
        System.out.println("Result: " + result);
    }
}`,

  go: `package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println(fibonacci(10))
}`,

  rust: `fn main() {
    let mut numbers = vec![1, 2, 3, 4, 5];
    
    for num in &mut numbers {
        *num *= 2;
    }
    
    println!("{:?}", numbers);
}`,

  cs: `using System;

public class Program {
    public static void Main() {
        var name = "World";
        Console.WriteLine($"Hello, {name}!");
    }
    
    public static int Sum(int a, int b) {
        return a + b;
    }
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    int x = 5;
    int y = 10;
    cout << "Sum: " << (x + y) << endl;
    return 0;
}`,
}

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
  const [showTemplates, setShowTemplates] = useState(false)
  const [showBatch, setShowBatch] = useState(false)
  const [viewMode, setViewMode] = useState<'normal' | 'diff'>('normal')

  // Keyboard shortcut: Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && code.trim() && !loading) {
        e.preventDefault()
        handleSubmit(e as any)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [code, loading])

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

  const loadTemplate = (lang: string) => {
    setCode(CODE_TEMPLATES[lang] || '')
    setLanguage(lang)
    setShowTemplates(false)
  }

  const handleExport = (format: 'json' | 'markdown' | 'csv') => {
    if (!result) return

    const exportData: ExportData = {
      code,
      language,
      mode,
      model,
      timestamp: new Date().toISOString(),
      review: result.review,
      issues: result.issues,
      suggestions: result.suggestions,
    }

    if (format === 'json') exportAsJSON(exportData)
    else if (format === 'markdown') exportAsMarkdown(exportData)
    else if (format === 'csv') exportAsCSV(exportData)
  }

  return (
    <div className="space-y-8">
      {/* Control Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-all shadow-sm"
          >
            Templates
          </button>
          <button
            onClick={() => setShowBatch(!showBatch)}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-all shadow-sm"
          >
            Batch Upload
          </button>
          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-all shadow-sm"
            >
              History ({history.length})
            </button>
          )}
        </div>
      </div>

      {/* Templates Section */}
      {showTemplates && (
        <div className="p-5 bg-linear-to-br from-blue-50 to-blue-50/50 border border-blue-200 rounded-xl shadow-sm animate-slideDown">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Code Templates</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(CODE_TEMPLATES).map((lang) => (
              <button
                key={lang}
                onClick={() => loadTemplate(lang)}
                className={`px-3 py-2.5 rounded-lg text-xs font-medium border-2 transition-all ${
                  language === lang
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100'
                }`}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Batch Upload Section */}
      {showBatch && (
        <div className="p-5 bg-linear-to-br from-amber-50 to-amber-50/50 border border-amber-200 rounded-xl shadow-sm animate-slideDown">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Batch Code Review</h3>
          <BatchUpload
            model={model}
            mode={mode}
            onComplete={(files) => {
              console.log('Batch review complete:', files)
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Mode Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Review Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {REVIEW_MODES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={`p-4 rounded-xl border-2 transition-all shadow-sm ${
                    mode === m.value
                      ? 'bg-blue-50 text-blue-900 border-blue-300 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100'
                  }`}
                >
                  <p className="font-semibold text-sm">{m.label}</p>
                  <p className="text-xs text-slate-500 mt-1.5">{m.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Language & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2.5">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm hover:border-slate-400 transition-all"
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
              <label className="block text-sm font-semibold text-slate-900 mb-2.5">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm hover:border-slate-400 transition-all"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m?.split('/').pop()?.replace(':free', '') || m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Code Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-semibold text-slate-900">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-80 px-4 py-3.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none shadow-sm hover:border-slate-400 transition-all placeholder:text-slate-400"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                title="Ctrl+Enter to submit"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Analyzing...
                  </>
                ) : (
                  <>Review Code</>
                )}
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-all shadow-sm"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg animate-slideDown">
              <p className="text-red-900 text-sm font-medium">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4 bg-white border border-slate-300 rounded-xl p-5 max-h-96 overflow-y-auto shadow-md animate-fadeIn">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-base font-semibold text-slate-900">Review Results</h3>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setViewMode('normal')}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                      viewMode === 'normal'
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setViewMode('diff')}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                      viewMode === 'diff'
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Code View
                  </button>
                </div>

                {/* Export Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-slate-200">
                  <button
                    onClick={() => handleExport('markdown')}
                    className="text-xs px-2.5 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-all font-medium shadow-sm"
                  >
                    Markdown
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="text-xs px-2.5 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-all font-medium shadow-sm"
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="text-xs px-2.5 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-all font-medium shadow-sm"
                  >
                    CSV
                  </button>
                </div>
              </div>

              {viewMode === 'diff' ? (
                <DiffView
                  originalCode={code}
                  language={language}
                  suggestions={result.suggestions}
                />
              ) : (
                <>
                  {result.review && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                        Analysis
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {result.review}
                      </p>
                    </div>
                  )}

                  {result.issues.length > 0 && (
                    <div className="pt-3 border-t border-slate-200">
                      <h4 className="font-semibold text-red-700 text-xs mb-2.5 uppercase tracking-wider">
                        Issues ({result.issues.length})
                      </h4>
                      <ul className="space-y-1.5">
                        {result.issues.map((issue, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex gap-2">
                            <span className="text-red-600 font-bold shrink-0">●</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.suggestions.length > 0 && (
                    <div className="pt-3 border-t border-slate-200">
                      <h4 className="font-semibold text-amber-700 text-xs mb-2.5 uppercase tracking-wider">
                        Suggestions ({result.suggestions.length})
                      </h4>
                      <ul className="space-y-1.5">
                        {result.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex gap-2">
                            <span className="text-amber-600 font-bold shrink-0">→</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {!result && !error && !loading && (
            <div className="p-6 bg-linear-to-br from-slate-50 to-slate-50/50 border border-dashed border-slate-300 rounded-xl text-center shadow-sm">
              <p className="text-slate-500 text-sm font-medium">Results will appear here</p>
            </div>
          )}

          {loading && (
            <div className="p-6 bg-linear-to-br from-blue-50 to-blue-50/50 border border-blue-200 rounded-xl text-center shadow-sm animate-slideDown">
              <div className="flex justify-center mb-3">
                <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-blue-800 text-sm font-medium">Analyzing code...</p>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      {showHistory && history.length > 0 && (
        <div className="p-5 bg-white border border-slate-300 rounded-xl shadow-md animate-slideDown">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Review History</h3>
          <div className="space-y-2.5 max-h-64 overflow-y-auto">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => loadFromHistory(item)}
                className="w-full text-left p-3.5 bg-slate-50 hover:bg-blue-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-all text-sm group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-xs text-blue-600 font-medium">
                      {item.language} • {item.mode} • {item.model?.split('-')[0] || 'Auto'}
                    </p>
                    <p className="text-slate-600 truncate text-sm mt-1 group-hover:text-slate-700">
                      {item.code.slice(0, 50)}...
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
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

