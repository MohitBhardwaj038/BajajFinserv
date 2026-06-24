/**
 * Utility functions for the /bfhl endpoint.
 *
 * All graph logic is kept here so the controller stays thin.
 */

// ─────────────────────────────────────────────────────────
//  1. validateEdge
// ─────────────────────────────────────────────────────────

/**
 * Validates a single edge entry.
 *
 * Valid format: exactly  X->Y
 *   - X is a single uppercase letter A-Z
 *   - Y is a single uppercase letter A-Z
 *   - X !== Y  (self-loops are invalid)
 *
 * Leading/trailing whitespace is trimmed before validation.
 *
 * @param {*} entry - raw value from the request data array
 * @returns {{ valid: boolean, trimmed: string, from?: string, to?: string }}
 */
function validateEdge(entry) {
  // Coerce non-strings so we can still include them in invalid_entries
  if (typeof entry !== 'string') {
    return { valid: false, trimmed: String(entry).trim() };
  }

  const trimmed = entry.trim();

  // Empty string is invalid
  if (trimmed.length === 0) {
    return { valid: false, trimmed };
  }

  // Must be exactly: one uppercase letter, the literal '->', one uppercase letter
  const match = trimmed.match(/^([A-Z])->([A-Z])$/);
  if (!match) {
    return { valid: false, trimmed };
  }

  const [, from, to] = match;

  // Self-loop (A->A) is explicitly invalid
  if (from === to) {
    return { valid: false, trimmed };
  }

  return { valid: true, trimmed, from, to };
}

// ─────────────────────────────────────────────────────────
//  2. findDuplicates
// ─────────────────────────────────────────────────────────

/**
 * Identifies duplicate edge strings from an ordered list of valid trimmed edges.
 *
 * @param {string[]} validEdgeStrings - e.g. ["A->B","A->B","C->D"]
 * @returns {string[]} unique duplicated edge strings, sorted alphabetically
 */
function findDuplicates(validEdgeStrings) {
  const seen = new Set();
  const duplicates = new Set();

  for (const edge of validEdgeStrings) {
    if (seen.has(edge)) {
      duplicates.add(edge);
    } else {
      seen.add(edge);
    }
  }

  return Array.from(duplicates).sort();
}

// ─────────────────────────────────────────────────────────
//  3. buildGraph
// ─────────────────────────────────────────────────────────

/**
 * Builds a directed graph from deduplicated edge objects, enforcing the
 * multi-parent rule (first parent wins — later parents for the same child
 * are silently ignored).
 *
 * @param {{ from: string, to: string }[]} uniqueEdges - edges in input order,
 *        already deduplicated
 * @returns {{
 *   parentOf:   Record<string, string>,   // child  → parent
 *   childrenOf: Record<string, string[]>, // parent → sorted children
 *   allNodes:   Set<string>               // every node that appeared
 * }}
 */
function buildGraph(uniqueEdges) {
  const parentOf = {};
  const childrenOf = {};
  const allNodes = new Set();

  for (const { from, to } of uniqueEdges) {
    allNodes.add(from);
    allNodes.add(to);

    // Multi-parent rule: if this child already has a parent, skip
    if (Object.prototype.hasOwnProperty.call(parentOf, to)) continue;

    parentOf[to] = from;
    if (!childrenOf[from]) childrenOf[from] = [];
    childrenOf[from].push(to);
  }

  // Sort each parent's children for deterministic output
  for (const key of Object.keys(childrenOf)) {
    childrenOf[key].sort();
  }

  return { parentOf, childrenOf, allNodes };
}

// ─────────────────────────────────────────────────────────
//  4. detectCycle  (+ helper: findComponents)
// ─────────────────────────────────────────────────────────

/**
 * Groups nodes into connected components using BFS over the
 * accepted (post-multi-parent) edges treated as undirected.
 *
 * Isolated nodes (whose only edges were rejected) become their own component.
 *
 * @param {Set<string>}                allNodes
 * @param {Record<string, string>}     parentOf
 * @returns {string[][]} array of components, each sorted lexicographically
 */
function findComponents(allNodes, parentOf) {
  // Build undirected adjacency from the accepted parent→child relationships
  const adj = {};
  for (const node of allNodes) adj[node] = new Set();

  for (const [child, parent] of Object.entries(parentOf)) {
    adj[parent].add(child);
    adj[child].add(parent);
  }

  const visited = new Set();
  const components = [];

  // Iterate in sorted order for deterministic component ordering
  for (const node of Array.from(allNodes).sort()) {
    if (visited.has(node)) continue;

    const component = [];
    const queue = [node];
    visited.add(node);

    while (queue.length > 0) {
      const current = queue.shift();
      component.push(current);
      for (const neighbor of adj[current]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    components.push(component.sort());
  }

  return components;
}

/**
 * Detects whether a directed cycle exists within a component
 * using DFS 3-colour marking.
 *
 * @param {string[]}                   component
 * @param {Record<string, string[]>}   childrenOf
 * @returns {boolean}
 */
function detectCycle(component, childrenOf) {
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;

  const color = {};
  for (const node of component) color[node] = WHITE;

  function dfs(node) {
    color[node] = GRAY;
    const children = childrenOf[node] || [];
    for (const child of children) {
      // Only consider children inside this component
      if (!(child in color)) continue;
      if (color[child] === GRAY) return true;   // back-edge → cycle
      if (color[child] === WHITE && dfs(child)) return true;
    }
    color[node] = BLACK;
    return false;
  }

  for (const node of component) {
    if (color[node] === WHITE) {
      if (dfs(node)) return true;
    }
  }

  return false;
}

// ─────────────────────────────────────────────────────────
//  5. buildTree
// ─────────────────────────────────────────────────────────

/**
 * Recursively constructs a nested tree object from the given root.
 *
 * @param {string}                     root
 * @param {Record<string, string[]>}   childrenOf
 * @returns {{ value: string, children?: object[] }}
 */
function buildTree(root, childrenOf) {
  const node = { value: root };
  const children = childrenOf[root] || [];

  if (children.length > 0) {
    node.children = children.map((child) => buildTree(child, childrenOf));
  }

  return node;
}

// ─────────────────────────────────────────────────────────
//  6. calculateDepth
// ─────────────────────────────────────────────────────────

/**
 * Returns the number of nodes on the longest root-to-leaf path.
 *   A -> B -> C  ⇒  depth = 3
 *
 * @param {{ value: string, children?: object[] }} tree
 * @returns {number}
 */
function calculateDepth(tree) {
  if (!tree) return 0;
  if (!tree.children || tree.children.length === 0) return 1;
  return 1 + Math.max(...tree.children.map(calculateDepth));
}

// ─────────────────────────────────────────────────────────
//  7. generateSummary
// ─────────────────────────────────────────────────────────

/**
 * Produces the top-level summary object from the hierarchies array.
 *
 * largest_tree_root: root of tree with maximum depth.
 * Tie-breaker: lexicographically smaller root wins.
 * If every hierarchy is a cycle, largest_tree_root is null.
 *
 * @param {object[]} hierarchies
 * @returns {{ total_trees: number, total_cycles: number, largest_tree_root: string|null }}
 */
function generateSummary(hierarchies) {
  let totalTrees = 0;
  let totalCycles = 0;
  let largestTreeRoot = null;
  let maxDepth = 0;

  for (const h of hierarchies) {
    if (h.has_cycle) {
      totalCycles++;
    } else {
      totalTrees++;
      if (
        h.depth > maxDepth ||
        (h.depth === maxDepth && (largestTreeRoot === null || h.root < largestTreeRoot))
      ) {
        maxDepth = h.depth;
        largestTreeRoot = h.root;
      }
    }
  }

  return {
    total_trees: totalTrees,
    total_cycles: totalCycles,
    largest_tree_root: largestTreeRoot,
  };
}

// ─────────────────────────────────────────────────────────
//  Orchestrator — ties everything together
// ─────────────────────────────────────────────────────────

/**
 * Main processing pipeline. Accepts the raw `data` array from the request
 * and returns the full result object (minus user identity fields).
 *
 * @param {*[]} data
 * @returns {{ hierarchies, invalid_entries, duplicate_edges, summary }}
 */
function processEdges(data) {
  // ── Step 1: Validate every entry ──
  const invalidEntries = [];
  const validParsed = [];          // { trimmed, from, to }
  const validTrimmedStrings = [];  // just the trimmed strings, in order

  for (const entry of data) {
    const result = validateEdge(entry);
    if (!result.valid) {
      invalidEntries.push(result.trimmed);
    } else {
      validParsed.push(result);
      validTrimmedStrings.push(result.trimmed);
    }
  }

  // ── Step 2: Find duplicates ──
  const duplicateEdges = findDuplicates(validTrimmedStrings);

  // ── Step 3: Deduplicate (keep first occurrence) ──
  const seenEdges = new Set();
  const uniqueEdges = [];
  for (const edge of validParsed) {
    if (seenEdges.has(edge.trimmed)) continue;
    seenEdges.add(edge.trimmed);
    uniqueEdges.push(edge);
  }

  // ── Step 4: Build graph with multi-parent rule ──
  const { parentOf, childrenOf, allNodes } = buildGraph(uniqueEdges);

  // ── Step 5: Find connected components ──
  const components = findComponents(allNodes, parentOf);

  // ── Step 6: Process each component into a hierarchy entry ──
  const hierarchies = [];

  for (const component of components) {
    const hasCycle = detectCycle(component, childrenOf);

    // Find root: node that never appears as a child in accepted edges
    const roots = component.filter(
      (n) => !Object.prototype.hasOwnProperty.call(parentOf, n),
    );

    // If no root exists (pure cycle), pick lexicographically smallest node
    const root = roots.length > 0 ? roots.sort()[0] : component[0]; // component is already sorted

    if (hasCycle) {
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const tree = buildTree(root, childrenOf);
      const depth = calculateDepth(tree);
      hierarchies.push({ root, tree, depth });
    }
  }

  // ── Step 7: Summary ──
  const summary = generateSummary(hierarchies);

  return {
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary,
  };
}

module.exports = {
  validateEdge,
  findDuplicates,
  buildGraph,
  detectCycle,
  buildTree,
  calculateDepth,
  generateSummary,
  processEdges,
};
