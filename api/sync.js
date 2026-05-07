module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const WF_TOKEN = process.env.WEBFLOW_TOKEN;
  const WF_COLLECTION = process.env.WEBFLOW_COLLECTION_ID;

  try {
    // 1. Récupérer les biens depuis WordPress
    const wpRes = await fetch('https://ebimmo.com/wp-json/ebimmo/v1/properties');
    const properties = await wpRes.json();

    // 2. Récupérer les items existants dans Webflow
    const existingRes = await fetch(`https://api.webflow.com/v2/collections/${WF_COLLECTION}/items`, {
      headers: {
        'Authorization': `Bearer ${WF_TOKEN}`,
        'accept': 'application/json'
      }
    });
    const existing = await existingRes.json();
    const existingRefs = existing.items?.map(i => i.fieldData?.reference) || [];

    // 3. Ajouter seulement les nouveaux biens
    const results = [];
    for (const p of properties.slice(0, 5)) { // test avec 5 biens
      if (existingRefs.includes(p.reference)) {
        results.push({ reference: p.reference, status: 'already exists' });
        continue;
      }

      const area = p.area?.value || p.area?.total || 0;
      const price = parseInt(p.price) || 0;

      const body = {
        fieldData: {
          name: p.title,
          slug: p.reference,
          price: price,
          surface: Math.round(area),
          rooms: parseInt(p.rooms) || 0,
          reference: p.reference,
          'property-url': p.url,
          'image-url': p.thumbnail || '',
        }
      };

      const createRes = await fetch(`https://api.webflow.com/v2/collections/${WF_COLLECTION}/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WF_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        bo
