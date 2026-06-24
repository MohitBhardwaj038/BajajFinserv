/**
 * Hero section with animated gradient title.
 */
export default function HeroSection() {
  return (
    <header className="text-center pt-16 pb-10 px-4 animate-fade-in">
      {/* Decorative badge */}
      <div className="inline-flex items-center gap-2 badge badge-info mb-6">
        <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse-dot" />
        Full Stack Engineering Challenge
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold gradient-text leading-tight mb-4">
        Hierarchy Builder
      </h1>

      <p className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
        Enter directed edges to build tree hierarchies, detect cycles, and visualise
        graph relationships in real time.
      </p>
    </header>
  );
}
