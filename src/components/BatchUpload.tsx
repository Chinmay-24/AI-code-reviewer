'use client'

import { useState } from 'react'
import { submitCodeForReview, AVAILABLE_MODELS } from '@/lib/openrouter'

interface BatchFile {
  id: string
  name: string
  code: string
  language: string
  status: 'pending' | 'reviewing' | 'done' | 'error'
  error?: string
  result?: any
}

interface BatchUploadProps {
  model: string
  mode: string
  onComplete?: (files: BatchFile[]) => void
}

export default function BatchUpload({ model, mode, onComplete }: BatchUploadProps) {
  const [files, setFiles] = useState<BatchFile[]>([])
  const [reviewing, setReviewing] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const newFiles = selectedFiles.map((file) => ({
      id: Math.random().toString(36),
      name: file.name,
      code: '',
      language: detectLanguage(file.name),
      status: 'pending' as const,
    }))

    selectedFiles.forEach((file, idx) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const code = event.target?.result as string
        setFiles((prevFiles) => {
          const updated = [...prevFiles]
          const fileIdx = updated.findIndex((f) => f.name === file.name)
          if (fileIdx !== -1) {
            updated[fileIdx].code = code
          }
          return updated
        })
      }
      reader.readAsText(file)
    })

    setFiles((prev) => [...prev, ...newFiles])
  }

  const detectLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'cpp',
      'go': 'go',
      'rs': 'rust',
      'cs': 'cs',
      'rb': 'ruby',
      'php': 'php',
    }
    return languageMap[ext] || 'javascript'
  }

  const reviewAll = async () => {
    setReviewing(true)
    const pendingFiles = files.filter((f) => f.code)

    for (const file of pendingFiles) {
      if (!file.code) continue

      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: 'reviewing' } : f))
      )

      try {
        const result = await submitCodeForReview(file.code, file.language, model, mode)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: 'done', result } : f
          )
        )
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Review failed',
                }
              : f
          )
        )
      }
    }

    setReviewing(false)
    onComplete?.(files)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const readyToReview = files.filter((f) => f.code).length > 0

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-blue-400 hover:bg-blue-50/50 transition cursor-pointer bg-gradient-to-br from-white to-slate-50/50 shadow-sm">
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="batch-upload"
          accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.go,.rs,.cs,.rb,.php"
        />
        <label htmlFor="batch-upload" className="cursor-pointer block text-center">
          <div className="text-4xl mb-3">📁</div>
          <p className="text-sm font-semibold text-slate-900\">Drop files here or click to select</p>
          <p className="text-xs text-slate-500 mt-2\">Supports: js, ts, py, java, cpp, go, rs, cs, rb, php</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-sm font-semibold text-slate-900\">
              Files ({files.filter((f) => f.code).length} / {files.length})
            </h4>
            {files.length > 0 && (
              <button
                onClick={() => setFiles([])}
                className="text-xs px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={`text-xs p-3.5 rounded-lg border flex justify-between items-center transition shadow-sm ${
                  file.status === 'done'
                    ? 'bg-green-50 border-green-300 hover:shadow-md'
                    : file.status === 'error'
                    ? 'bg-red-50 border-red-300 hover:shadow-md'
                    : file.status === 'reviewing'
                    ? 'bg-blue-50 border-blue-300 hover:shadow-md'
                    : file.code
                    ? 'bg-white border-slate-300 hover:shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:shadow-md'
                }`}
              >
                <div className="flex-1">
                  <p className="text-slate-900 font-mono font-medium">{file.name}</p>
                  <p className="text-slate-600 mt-1\">
                    {file.language} •{' '}
                    {file.status === 'reviewing' && '⏳ Reviewing...'}
                    {file.status === 'done' && '✓ Done'}
                    {file.status === 'error' && `✕ ${file.error}`}
                    {file.status === 'pending' && (file.code ? 'Ready' : 'Loading...')}
                  </p>
                </div>
                {file.status !== 'reviewing' && (
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded px-2 py-1 transition ml-2 font-semibold"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={reviewAll}
            disabled={!readyToReview || reviewing}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {reviewing ? '⏳ Reviewing...' : `Review All (${files.filter((f) => f.code).length})`}
          </button>
        </div>
      )}
    </div>
  )
}
