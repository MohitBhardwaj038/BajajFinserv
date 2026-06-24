import { useState } from 'react';

/**
 * Textarea input with submit button.
 * Parses one edge per line and calls onSubmit with the data array.
 */
export default function InputArea({ onSubmit, isLoading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Split by newlines, filter out empty lines
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    onSubmit(lines);
  };

  const handleExample = () => {
    setText('A->B\nA->C\nB->D\nC->E\nE->F');
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6 animate-slide-up max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="edge-input" className="text-sm font-semibold text-white/70 tracking-wide uppercase">
          Edge Input
        </label>
        <button
          type="button"
          onClick={handleExample}
          className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium cursor-pointer"
        >
          Load Example
        </button>
      </div>

      {/* Textarea */}
      <textarea
        id="edge-input"
        className="glass-input w-full p-4 text-sm leading-relaxed"
        rows={7}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"A->B\nA->C\nB->D\n\nOne edge per line (format: X->Y)"}
        spellCheck={false}
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-white/25">
          {text.split('\n').filter((l) => l.trim()).length} edge(s)
        </p>

        <button
          type="submit"
          disabled={isLoading || text.trim().length === 0}
          className="btn-glow text-sm"
        >
          <span className="flex items-center gap-2">
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </>
            ) : (
              <>
                Build Hierarchies
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
