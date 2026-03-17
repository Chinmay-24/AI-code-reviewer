'use client'

interface DiffViewProps {
  originalCode: string
  language: string
  suggestions: string[]
}

export default function DiffView({ originalCode, language, suggestions }: DiffViewProps) {
  const lines = originalCode.split('\n')
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Original Code */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 mb-3 uppercase tracking-wider">Original Code</h4>
          <div className="bg-linear-to-br from-slate-50 to-slate-50/50 rounded-lg border border-slate-200 p-4 overflow-x-auto shadow-sm">
            <pre className="text-xs text-slate-700 font-mono leading-relaxed">
              {lines.map((line, i) => (
                <div key={i} className="flex hover:bg-slate-100/50 transition-colors px-2 py-0.5">
                  <span className="w-10 text-slate-400 text-right pr-4 select-none font-medium">{i + 1}</span>
                  <span className="flex-1">{line || '\n'}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-900 mb-3 uppercase tracking-wider">
              {suggestions.length} {suggestions.length === 1 ? 'Suggestion' : 'Suggestions'}
            </h4>
            <div className="space-y-2.5">
              {suggestions.map((suggestion, i) => (
                <div key={i} className="bg-linear-to-br from-amber-50 to-amber-50/50 border border-amber-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-3">
                    <span className="text-amber-700 font-bold shrink-0 text-sm mt-0.5">{i + 1}.</span>
                    <p className="text-sm text-slate-700 leading-relaxed">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}