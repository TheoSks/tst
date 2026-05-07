module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const WF_TOKEN = process.env.WEBFLOW_TOKEN;
  const WF_COLLECTION = process.env.WEBFLOW_COLLECTION_ID;

  try {
    const wpRes = await fetch('https://ebimmo.com/wp-json/ebimmo/v1/properties');
    const properties = await wpRes.json();

    const existingRes = await fetch(`https://api.webflow.com/v2/collections/${WF_COLLECTION}/items?limit=100`, {
      headers: {
        'Authorization': `Bearer ${WF_TOKEN}`,
        'accept': 'application/json'
      }
    });
    const existing = await existingRes.json();
    const existingNames = existing.items?.map(i => i.fieldData?.['nom-du-bien']) || [];

    const results = [];

    for (const p of properties.slice(0, 5)) {
      if (existingNames.includes(p.title)) {
        results.push({ title: p.title, status: 'already exists' });
        continue;
      }

      const area = p.area?.value || p.area?.total || 0;
      const price = parseInt(p.price) || 0;

      const body = {
        fieldData: {
          'nom-du-bien': p.title,
          'slug': p.reference,
          'prix-de-la-propriete': price,
          'surface-m2': Math.round(area),
          'nombre-de-chambres': parseInt(p.rooms) || 0,
          'emplacement-de-la-propriete': p.title.includes('CAEN') ? 'Caen' : 'Normandie',
          'details-de-la-propriete': `${p.rooms} pièces - ${Math.round(area)}m²`,
        }
      };

      const createRes = await fetch(`https://api.webflow.com/v2/collections/${WF_COLLECTION}/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WF_TOKEN}`,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const created = await createRes.json();
      results.push({ title: p.title, status: createRes.status, response: created });
    }

    return res.status(200).json({ success: true, processed: results });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
