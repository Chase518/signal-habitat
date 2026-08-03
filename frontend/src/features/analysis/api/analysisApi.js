const ANALYSIS_API_BASE_URL = import.meta.env.VITE_ANALYSIS_API_BASE_URL ?? "http://localhost:8080";

/**
 * Fetches the activity-vs-temperature analysis result from the Java
 * backend, which itself calls the Python analysis service as an outbound
 * adapter and caches the result (see docs/decisions.md). This is the only
 * function that needs to change if the backend integration point moves.
 */
export async function fetchAnalysis() {
  const response = await fetch(`${ANALYSIS_API_BASE_URL}/api/analysis`);
  if (!response.ok) {
    throw new Error(`analysis request failed with status ${response.status}`);
  }
  return response.json();
}
