/**
 * API service — all backend communication goes through here.
 */

const API_BASE = '/api';

/**
 * POST /api/bfhl with the given data array.
 * @param {string[]} data - array of edge strings
 * @returns {Promise<object>} parsed JSON response
 */
export async function postBfhl(data) {
  const response = await fetch(`${API_BASE}/bfhl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message || `Server error: ${response.status}`);
  }

  return body;
}
