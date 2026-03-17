'use client'

import CodeReviewer from '@/components/CodeReviewer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Code Reviewer</h1>
            <p className="text-slate-600 mt-2.5 text-sm leading-relaxed">
              AI-powered code analysis and feedback powered by OpenRouter
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CodeReviewer />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white shadow-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-500 text-xs font-medium tracking-wider">
            Built with Next.js 15, OpenRouter, and n8n
          </p>
        </div>
      </footer>
    </div>
  )
}
