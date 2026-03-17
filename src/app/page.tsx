'use client'

import CodeReviewer from '@/components/CodeReviewer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            AI Code Reviewer
          </h1>
          <p className="text-gray-400 mt-2">Get AI-powered insights on your code using OpenRouter & n8n</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CodeReviewer />
      </main>

      <footer className="border-t border-gray-700 bg-gray-900/50 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>Built with Next.js, OpenRouter, and n8n for the hackathon 🚀</p>
        </div>
      </footer>
    </div>
  );
}
