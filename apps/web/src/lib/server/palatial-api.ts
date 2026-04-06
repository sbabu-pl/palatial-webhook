export async function createLeadInCoreApi(payload: any) {
  const baseUrl = process.env.PALATIAL_API_BASE_URL;
  const apiKey = process.env.PALATIAL_INTERNAL_API_KEY;

  const response = await fetch(`${baseUrl}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey || ""
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}