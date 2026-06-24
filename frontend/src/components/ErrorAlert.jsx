/**
 * Error alert with dismiss capability.
 */
export default function ErrorAlert({ message, onDismiss }) {
  return (
    <div className="animate-slide-up glass !border-red-500/30 p-5 flex items-start gap-4">
      {/* Icon */}
      <div className="shrink-0 mt-0.5">
        <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-red-400 font-semibold text-sm mb-1">Something went wrong</h4>
        <p className="text-red-300/80 text-sm leading-relaxed break-words">{message}</p>
      </div>

      {/* Dismiss */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
          aria-label="Dismiss error"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
