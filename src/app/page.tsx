'use client'

import CodeReviewer from '@/components/CodeReviewer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>

      <header className="relative z-10 border-b border-gray-700 bg-gray-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-slideIn">
                AI Code Reviewer
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                ✨ Powered by OpenRouter | 🔍 Smart Code Analysis | ⚡ Instant Feedback
              </p>
            </div>
          </div>

          {/* Feature badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded-full">
              🚀 Quick Mode
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              📋 Detailed Analysis
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full">
              🔒 Security Scan
            </span>
            <span className="px-3 py-1 text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-full">
              💾 Review History
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CodeReviewer />
      </main>

      <footer className="relative z-10 border-t border-gray-700 bg-gray-900/50 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm mb-4">
            <p>Hackathon Edition • Built with Next.js 15, OpenRouter & n8n</p>
          </div>
          <div className="flex justify-center gap-4 text-gray-500 text-xs">
            <a href="https://openrouter.ai" target="_blank" rel="noopener" className="hover:text-gray-300 transition">
              OpenRouter
            </a>
            <span>•</span>
            <a href="https://n8n.io" target="_blank" rel="noopener" className="hover:text-gray-300 transition">
              n8n
            </a>
            <span>•</span>
            <a href="https://vercel.com" target="_blank" rel="noopener" className="hover:text-gray-300 transition">
              Vercel
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
