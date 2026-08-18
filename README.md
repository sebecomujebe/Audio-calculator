# Audio Calculator v0.89

Cloudflare Worker + Static Assets.

- `public/` – web calculator
- `src/index.js` – `/api/prices`
- `wrangler.jsonc` – Cloudflare configuration

Price behavior:
- attempts refresh after 24 hours,
- keeps the last successful server-side snapshot in Cloudflare Cache for up to 180 days,
- if AV Integra feed is unavailable during refresh, serves the last successful snapshot,
- browser also stores the last successful price payload locally as an additional fallback.

Feed:
`https://www.avintegra.cz/ShopItemFeed.asp?File=HeCZ0404asZ.xml`
