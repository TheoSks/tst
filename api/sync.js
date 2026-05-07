module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const WF_TOKEN = process.env.WEBFLOW_TOKEN;

  try {
    const sitesRes = await fetch('https://api.webflow.com/v2/sites', {
      headers: {
        'Authorization': `Bearer ${WF_TOKEN}`,
        'accept': 'application/json'
      }
    });

    const sites = await sitesRes.json();
    return res.status(200).json({ status: sitesRes.status, sites });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
