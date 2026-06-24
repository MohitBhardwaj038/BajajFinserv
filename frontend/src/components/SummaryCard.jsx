import GlassCard from './GlassCard';

/**
 * Summary statistics card.
 */
export default function SummaryCard({ summary }) {
  if (!summary) return null;

  const stats = [
    {
      label: 'Total Trees',
      value: summary.total_trees,
      color: 'text-accent-400',
      bg: 'bg-accent-400/15',
      border: 'border-accent-400/25',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
        </svg>
      ),
    },
    {
      label: 'Total Cycles',
      value: summary.total_cycles,
      color: 'text-red-400',
      bg: 'bg-red-500/15',
      border: 'border-red-500/25',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
        </svg>
      ),
    },
    {
      label: 'Largest Tree',
      value: summary.largest_tree_root || '—',
      color: 'text-primary-400',
      bg: 'bg-primary-500/15',
      border: 'border-primary-500/25',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
  ];

  return (
    <GlassCard delay={300}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <svg className="w-4.5 h-4.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <h3 className="font-semibold text-white/90 text-sm tracking-wide uppercase">
          Summary
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map(({ label, value, color, bg, border, icon }) => (
          <div
            key={label}
            className={`rounded-xl ${bg} border ${border} p-4 text-center transition-transform hover:scale-[1.02]`}
          >
            <div className={`${color} flex justify-center mb-2 opacity-70`}>{icon}</div>
            <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
            <div className="text-xs text-white/40 font-medium">{label}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
