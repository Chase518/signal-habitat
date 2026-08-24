const JAVA_API_BASE_URL = import.meta.env.VITE_ANALYSIS_API_BASE_URL ?? "http://localhost:8080";

export async function fetchDetections() {
  const response = await fetch(`${JAVA_API_BASE_URL}/api/detections`);
  if (!response.ok) {
    throw new Error(`detections request failed with status ${response.status}`);
  }
  return response.json();
}
