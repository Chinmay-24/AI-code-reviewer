'use client'

import { useState } from 'react'
import { UserSettings, storage } from '@/lib/storage'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  onSettingsChange: (settings: UserSettings) => void
}

export default function SettingsPanel({ isOpen, onClose, onSettingsChange }: SettingsPanelProps) {
  const [settings, setSettings] = useState<UserSettings>(storage.getSettings())

  const handleThemeChange = (theme: 'light' | 'dark') => {
    const updated = { ...settings, theme }
    setSettings(updated)
    storage.updateSettings(updated)
    onSettingsChange(updated)
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLanguageChange = (lang: string) => {
    const updated = { ...settings, defaultLanguage: lang }
    setSettings(updated)
    storage.updateSettings(updated)
    onSettingsChange(updated)
  }

  const handleModeChange = (mode: string) => {
    const updated = { ...settings, defaultMode: mode }
    setSettings(updated)
    storage.updateSettings(updated)
    onSettingsChange(updated)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6 space-y-6 animate-slideDown">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-xl"
          >
            ✕
          </button>
        </div>

        {/* Theme Setting */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            Theme
          </label>
          <div className="flex gap-3">
            {(['light', 'dark'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm border-2 transition-all ${
                  settings.theme === theme
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
              </button>
            ))}
          </div>
        </div>

        {/* Default Language */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            Default Language
          </label>
          <select
            value={settings.defaultLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 shadow-sm"
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

        {/* Default Review Mode */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            Default Review Mode
          </label>
          <select
            value={settings.defaultMode}
            onChange={(e) => handleModeChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 shadow-sm"
          >
            <option value="quick">Quick Review</option>
            <option value="detailed">Detailed Review</option>
            <option value="security">Security Focus</option>
          </select>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md"
        >
          Close Settings
        </button>
      </div>
    </div>
  )
}
