/**
 * Recursively renders a tree node with branch lines.
 *
 * Renders the classic tree structure:
 *   A
 *   ├─ B
 *   │  └─ D
 *   └─ C
 */
export default function TreeNode({ node, prefix = '', isLast = true, isRoot = true }) {
  if (!node) return null;

  const connector = isRoot ? '' : isLast ? '└─ ' : '├─ ';
  const childPrefix = isRoot ? '' : prefix + (isLast ? '   ' : '│  ');
  const children = node.children || [];

  return (
    <div className="font-mono text-sm leading-7">
      {/* Current node */}
      <div className="flex items-center gap-0 whitespace-pre">
        <span className="tree-line">{prefix}{connector}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-md bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-xs font-bold text-primary-300">
            {node.value}
          </span>
        </span>
      </div>

      {/* Recursively render children */}
      {children.map((child, idx) => (
        <TreeNode
          key={child.value}
          node={child}
          prefix={childPrefix}
          isLast={idx === children.length - 1}
          isRoot={false}
        />
      ))}
    </div>
  );
}
