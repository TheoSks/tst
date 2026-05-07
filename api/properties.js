module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const PROVIDER_ID = process.env.APIMO_PROVIDER_ID;
  const AGENCY_ID   = process.env.APIMO_AGENCY_ID;
  const TOKEN       = process.env.APIMO_TOKEN;

  const credentials = Buffer.from(`${PROVIDER_ID}:${TOKEN}`).toString('base64');

  // On liste les agences pour trouver le bon ID
  const url = `https://api.apimo.pro/providers/${PROVIDER_ID}/agencies`;

  try {
    const apiRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json',
        'X-API-TOKEN': TOKEN
      }
    });

    const data = await apiRes.json();

    return res.status(200).json({
      debug: { http_status: apiRes.status, url },
      response: data
    });

  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}
