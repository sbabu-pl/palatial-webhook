export async function createLeadInCoreApi(payload: any) {
  const baseUrl = process.env.PALATIAL_API_BASE_URL; // e.g., https://palatial-webhook.onrender.com
  const apiKey = process.env.PALATIAL_INTERNAL_API_KEY;

  // Ensure the path is exactly /api/leads
  const response = await fetch(`${baseUrl}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey || "" 
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lead API request failed with status ${response.status}: ${errorText}`);
  }

  return response.json();
}