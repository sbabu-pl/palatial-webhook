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
export async function getLeadsFromCoreApi() {
  const baseUrl = process.env.PALATIAL_API_BASE_URL;
  const apiKey = process.env.PALATIAL_INTERNAL_API_KEY;

  // This will show up in your VS Code Terminal
  console.log("DEBUG: Calling API at", baseUrl);
  console.log("DEBUG: Using Key:", apiKey ? "Key Found ✅" : "Key is EMPTY ❌");

  const response = await fetch(`${baseUrl}/api/leads`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey || "", // Render is looking for this!
      "Content-Type": "application/json"
    },
    cache: 'no-store' 
  });

  const data = await response.json();
  console.log("DEBUG: API Response:", data); // See if it says "Missing API key" here too
  return data;
}