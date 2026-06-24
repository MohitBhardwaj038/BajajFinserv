/**
 * Reusable glassmorphism card wrapper.
 */
export default function GlassCard({ children, className = '', delay = 0 }) {
  return (
    <div
      className={`glass p-6 animate-slide-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
