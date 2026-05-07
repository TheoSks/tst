export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const PROVIDER_ID = process.env.APIMO_PROVIDER_ID;
  const AGENCY_ID   = process.env.APIMO_AGENCY_ID;
  const TOKEN       = process.env.APIMO_TOKEN;

  // Token seul sans username
  const credentials = Buffer.from(`${TOKEN}:`).toString('base64');

  const { page = 1, limit = 12 } = req.query;
  const url = `https://api.apimo.pro/providers/${PROVIDER_ID}/agencies/${AGENCY_ID}/properties?limit=${limit}&page=${page}`;

  try {
    const apiRes = await fetch(url, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      }
    });

    const data = await apiRes.json();

    return res.status(200).json({
      debug: { http_status: apiRes.status, url, token_length: TOKEN?.length },
      response
