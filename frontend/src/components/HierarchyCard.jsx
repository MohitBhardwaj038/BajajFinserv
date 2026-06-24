import GlassCard from './GlassCard';
import TreeNode from './TreeNode';

/**
 * Displays a single hierarchy — either a tree with depth or a cycle warning.
 */
export default function HierarchyCard({ hierarchy, index }) {
  const isCycle = hierarchy.has_cycle;

  return (
    <GlassCard delay={100 + index * 80}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
              isCycle
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-accent-400/20 text-accent-400 border border-accent-400/30'
            }`}
          >
            {hierarchy.root}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/90">
              Root: {hierarchy.root}
            </h4>
            <p className="text-xs text-white/35 mt-0.5">
              Hierarchy #{index + 1}
            </p>
          </div>
        </div>

        {/* Badge */}
        {isCycle ? (
          <span className="badge badge-danger">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Cycle Detected
          </span>
        ) : (
          <span className="badge badge-success">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Depth: {hierarchy.depth}
          </span>
        )}
      </div>

      {/* Tree or Cycle visualization */}
      {isCycle ? (
        <div className="rounded-lg bg-red-500/[0.07] border border-red-500/20 p-5 text-center">
          <div className="text-3xl mb-2">🔄</div>
          <p className="text-red-400 font-medium text-sm">
            This group contains a cycle
          </p>
          <p className="text-red-300/50 text-xs mt-1">
            Tree structure cannot be rendered
          </p>
        </div>
      ) : (
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-4 overflow-x-auto">
          <TreeNode node={hierarchy.tree} />
        </div>
      )}
    </GlassCard>
  );
}
