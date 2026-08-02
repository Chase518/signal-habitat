const ANALYSIS_API_BASE_URL = import.meta.env.VITE_ANALYSIS_API_BASE_URL ?? "http://localhost:8000";

/**
 * Fetches the activity-vs-temperature analysis result from the Python
 * analysis service. Swapping this to call the Java backend later only
 * requires changing this function's implementation, not its callers.
 */
export async function fetchAnalysis() {
  const response = await fetch(`${ANALYSIS_API_BASE_URL}/api/analysis`);
  if (!response.ok) {
    throw new Error(`analysis request failed with status ${response.status}`);
  }
  return response.json();
}
