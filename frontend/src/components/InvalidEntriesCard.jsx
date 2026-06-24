import GlassCard from './GlassCard';

/**
 * Displays invalid entries returned by the API.
 */
export default function InvalidEntriesCard({ entries }) {
  if (!entries || entries.length === 0) return null;

  return (
    <GlassCard delay={200}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
          <svg className="w-4.5 h-4.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-white/90 text-sm tracking-wide uppercase">
            Invalid Entries
          </h3>
          <p className="text-xs text-white/35 mt-0.5">{entries.length} rejected</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {entries.map((entry, i) => (
          <span
            key={i}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono"
          >
            {entry || <span className="italic text-red-400/50">(empty)</span>}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
