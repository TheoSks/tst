module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const WF_TOKEN = process.env.WEBFLOW_TOKEN;
  const WF_SITE = process.env.WEBFLOW_SITE_ID;

  try {
    // Test simple : récupérer les infos du site
    const siteRes = await fetch(`https://api.webflow.com/v2/sites/${WF_SITE}`, {
      headers: {
        'Authorization': `Bearer ${WF_TOKEN}`,
        'accept': 'application/json'
      }
    });

    const site = await siteRes.json();
    return res.status(200).json({ status: siteRes.status, site });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
