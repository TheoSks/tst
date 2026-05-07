export default async function handler(req, res) {
  // CORS — autorise tous les domaines (Webflow inclus)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const PROVIDER_ID = process.env.APIMO_PROVIDER_ID;
  const AGENCY_ID   = process.env.APIMO_AGENCY_ID;
  const TOKEN       = process.env.APIMO_TOKEN;

  const credentials = Buffer.from(`${PROVIDER_ID}:${TOKEN}`).toString('base64');

  // Paramètres optionnels transmis depuis Webflow
  const { page = 1, limit = 12, category, city, price_min, price_max } = req.query;

  let url = `https://api.apimo.pro/providers/${PROVIDER_ID}/agencies/${AGENCY_ID}/properties?limit=${limit}&page=${page}`;
  if (category)  url += `&category=${category}`;
  if (city)      url += `&city=${encodeURIComponent(city)}`;
  if (price_min) url += `&price_min=${price_min}`;
  if (price_max) url += `&price_max=${price_max}`;

  try {
    const apiRes = await fetch(url, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: 'Apimo API error', details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}
