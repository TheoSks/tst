# Apimo Proxy — Vercel

Proxy serverless pour connecter Webflow à l'API Apimo sans problème de CORS.

## Déploiement

### 1. Mettre sur GitHub
- Crée un nouveau repo GitHub (ex: `apimo-proxy`)
- Upload tous ces fichiers dedans

### 2. Déployer sur Vercel
- Va sur [vercel.com](https://vercel.com)
- "Add New Project" → importe ton repo GitHub
- Dans **Environment Variables**, ajoute :

| Variable | Valeur |
|---|---|
| `APIMO_PROVIDER_ID` | `4019` |
| `APIMO_AGENCY_ID` | `23650` |
| `APIMO_TOKEN` | `5ccdef5377bd6f2f41681f17233c7818a3484333` |

- Clique sur **Deploy** ✅

### 3. Tester
Une fois déployé, ton URL sera :
```
https://ton-projet.vercel.app/api/properties
```

Paramètres disponibles :
- `?page=1` — pagination
- `?limit=12` — nombre de biens par page
- `?category=1` — filtre par catégorie
- `?city=Paris` — filtre par ville
- `?price_min=100000&price_max=500000` — filtre par prix

## Utilisation dans Webflow
```js
fetch('https://ton-projet.vercel.app/api/properties?limit=9')
  .then(r => r.json())
  .then(data => console.log(data))
```
