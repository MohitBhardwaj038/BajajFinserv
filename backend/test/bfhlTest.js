/**
 * Smoke-test script for POST /api/bfhl.
 *
 * Run:  node test/bfhlTest.js
 *
 * Starts the server on a random port, fires test requests, and prints results.
 */

const app = require('../app');

const PORT = 0; // let OS pick a free port

async function post(base, body) {
  const res = await fetch(`${base}/api/bfhl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

function assert(condition, label, detail) {
  if (condition) {
    console.log(`  ✅ ${label}`);
  } else {
    console.log(`  ❌ ${label}`);
    if (detail) console.log(`     Got: ${JSON.stringify(detail)}`);
    process.exitCode = 1;
  }
}

async function runTests(base) {
  let res;

  // ── Test 1: Basic happy path ──
  console.log('\n── Test 1: Basic tree ──');
  res = await post(base, { data: ['A->B', 'A->C', 'B->D'] });
  assert(res.status === 200, 'Status 200');
  assert(res.body.invalid_entries.length === 0, 'No invalid entries');
  assert(res.body.duplicate_edges.length === 0, 'No duplicates');
  assert(res.body.hierarchies.length === 1, '1 hierarchy');
  assert(res.body.hierarchies[0].root === 'A', 'Root is A');
  assert(res.body.hierarchies[0].depth === 3, 'Depth is 3', res.body.hierarchies[0].depth);
  assert(res.body.summary.total_trees === 1, 'total_trees = 1');
  assert(res.body.summary.total_cycles === 0, 'total_cycles = 0');
  assert(res.body.summary.largest_tree_root === 'A', 'largest_tree_root = A');

  // ── Test 2: Invalid entries ──
  console.log('\n── Test 2: Invalid entries ──');
  res = await post(base, { data: ['hello', '1->2', 'AB->C', 'A-B', 'A->', 'A->A', '', 'A->B'] });
  assert(res.body.invalid_entries.length === 7, '7 invalid entries', res.body.invalid_entries);
  assert(res.body.hierarchies.length === 1, '1 valid tree');
  assert(res.body.hierarchies[0].root === 'A', 'Root is A');

  // ── Test 3: Duplicate edges ──
  console.log('\n── Test 3: Duplicate edges ──');
  res = await post(base, { data: ['A->B', 'A->B', 'A->B'] });
  assert(res.body.duplicate_edges.length === 1, '1 duplicate', res.body.duplicate_edges);
  assert(res.body.duplicate_edges[0] === 'A->B', 'Duplicate is A->B');
  assert(res.body.hierarchies.length === 1, '1 hierarchy');

  // ── Test 4: Multi-parent rule ──
  console.log('\n── Test 4: Multi-parent (first parent wins) ──');
  res = await post(base, { data: ['A->D', 'B->D'] });
  assert(res.body.hierarchies.length === 2, '2 hierarchies (B isolated)', res.body.hierarchies);
  const treeA = res.body.hierarchies.find((h) => h.root === 'A');
  const treeB = res.body.hierarchies.find((h) => h.root === 'B');
  assert(treeA && treeA.depth === 2, 'A->D depth = 2', treeA);
  assert(treeB && treeB.depth === 1, 'B standalone depth = 1', treeB);

  // ── Test 5: Pure cycle ──
  console.log('\n── Test 5: Pure cycle ──');
  res = await post(base, { data: ['A->B', 'B->C', 'C->A'] });
  assert(res.body.hierarchies.length === 1, '1 hierarchy');
  assert(res.body.hierarchies[0].has_cycle === true, 'has_cycle = true');
  assert(res.body.hierarchies[0].root === 'A', 'Root = lex smallest A');
  assert(JSON.stringify(res.body.hierarchies[0].tree) === '{}', 'tree is {}');
  assert(res.body.hierarchies[0].depth === undefined, 'No depth for cycle');
  assert(res.body.summary.total_cycles === 1, 'total_cycles = 1');

  // ── Test 6: Two-node cycle ──
  console.log('\n── Test 6: Two-node cycle ──');
  res = await post(base, { data: ['A->B', 'B->A'] });
  assert(res.body.hierarchies[0].has_cycle === true, 'has_cycle = true');

  // ── Test 7: Multiple separate trees ──
  console.log('\n── Test 7: Multiple trees ──');
  res = await post(base, { data: ['A->B', 'C->D', 'C->E'] });
  assert(res.body.hierarchies.length === 2, '2 hierarchies');
  assert(res.body.summary.total_trees === 2, 'total_trees = 2');

  // ── Test 8: Largest tree tie-break ──
  console.log('\n── Test 8: Tie-break on largest_tree_root ──');
  res = await post(base, { data: ['A->B', 'C->D'] }); // both depth 2
  assert(res.body.summary.largest_tree_root === 'A', 'Tie-break: A < C');

  // ── Test 9: Whitespace trimming ──
  console.log('\n── Test 9: Whitespace trimming ──');
  res = await post(base, { data: ['  A->B  ', ' C->D'] });
  assert(res.body.invalid_entries.length === 0, 'Trimmed entries are valid');
  assert(res.body.hierarchies.length === 2, '2 hierarchies');

  // ── Test 10: Empty data array ──
  console.log('\n── Test 10: Empty data array ──');
  res = await post(base, { data: [] });
  assert(res.status === 200, 'Status 200');
  assert(res.body.hierarchies.length === 0, 'No hierarchies');
  assert(res.body.summary.total_trees === 0, '0 trees');
  assert(res.body.summary.largest_tree_root === null, 'No largest_tree_root');

  // ── Test 11: Missing data field ──
  console.log('\n── Test 11: Missing data field ──');
  res = await post(base, {});
  assert(res.status === 400, 'Status 400');

  // ── Test 12: Mixed valid, invalid, duplicate, cycle ──
  console.log('\n── Test 12: Kitchen-sink ──');
  res = await post(base, {
    data: ['A->B', 'B->C', 'C->A', 'D->E', 'D->E', 'hello', 'X->Y', 'Y->Z'],
  });
  assert(res.body.invalid_entries.length === 1, '1 invalid');
  assert(res.body.duplicate_edges.length === 1, '1 duplicate');
  const cycleH = res.body.hierarchies.find((h) => h.has_cycle);
  const treeD = res.body.hierarchies.find((h) => h.root === 'D');
  const treeX = res.body.hierarchies.find((h) => h.root === 'X');
  assert(cycleH !== undefined, 'Cycle found');
  assert(treeD && treeD.depth === 2, 'D->E depth = 2');
  assert(treeX && treeX.depth === 3, 'X->Y->Z depth = 3');
  assert(res.body.summary.total_trees === 2, '2 trees');
  assert(res.body.summary.total_cycles === 1, '1 cycle');
  assert(res.body.summary.largest_tree_root === 'X', 'Largest = X (depth 3)');

  // ── Test 13: Non-string entries ──
  console.log('\n── Test 13: Non-string entries ──');
  res = await post(base, { data: [123, null, true, 'A->B'] });
  assert(res.body.invalid_entries.length === 3, '3 invalid non-strings', res.body.invalid_entries);
  assert(res.body.hierarchies.length === 1, '1 valid tree');

  // ── Test 14: Identity fields present ──
  console.log('\n── Test 14: Identity fields ──');
  res = await post(base, { data: ['A->B'] });
  assert(typeof res.body.user_id === 'string' && res.body.user_id.length > 0, 'user_id present');
  assert(typeof res.body.email_id === 'string', 'email_id present');
  assert(typeof res.body.college_roll_number === 'string', 'college_roll_number present');
}

// ── Runner ──
const server = app.listen(PORT, async () => {
  const { port } = server.address();
  const base = `http://localhost:${port}`;
  console.log(`Test server running on ${base}`);

  try {
    await runTests(base);
  } catch (err) {
    console.error('\n💥 Unhandled error in tests:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    console.log('\nDone.');
  }
});
