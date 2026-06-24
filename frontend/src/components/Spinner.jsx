/**
 * Loading spinner with optional message.
 */
export default function Spinner({ message = 'Processing...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
      <div className="spinner" />
      <p className="text-sm text-white/50 font-medium tracking-wide">{message}</p>
    </div>
  );
}
