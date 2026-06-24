import GlassCard from './GlassCard';

/**
 * Displays user identity information.
 */
export default function UserInfoCard({ userId, emailId, collegeRollNumber }) {
  const fields = [
    { label: 'User ID', value: userId, icon: '👤' },
    { label: 'Email', value: emailId, icon: '✉️' },
    { label: 'Roll Number', value: collegeRollNumber, icon: '🎓' },
  ];

  return (
    <GlassCard delay={50}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <svg className="w-4.5 h-4.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h3 className="font-semibold text-white/90 text-sm tracking-wide uppercase">
          User Information
        </h3>
      </div>

      <div className="grid gap-3">
        {fields.map(({ label, value, icon }) => (
          <div
            key={label}
            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
          >
            <span className="text-sm text-white/40 flex items-center gap-2">
              <span>{icon}</span>
              {label}
            </span>
            <span className="text-sm font-medium text-white/80 font-mono">{value}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
