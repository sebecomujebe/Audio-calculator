const FEED_URL = "https://www.avintegra.cz/ShopItemFeed.asp?File=HeCZ0404asZ.xml";

const REFRESH_AFTER_MS = 24 * 60 * 60 * 1000; // zkusit obnovu 1x denně
const STALE_RETENTION_SECONDS = 180 * 24 * 60 * 60; // poslední dobrá data držet 180 dní

function xmlDecode(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function getXmlTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? xmlDecode(match[1].trim()) : "";
}

function parsePrice(value) {
  if (value == null) return NaN;
  const normalized = String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(",", ".");
  const price = Number(normalized);
  return Number.isFinite(price) ? price : NaN;
}

function parseFeed(xml) {
  const items = {};
  const blocks = xml.match(/<SHOPITEM\b[^>]*>[\s\S]*?<\/SHOPITEM>/gi) || [];

  for (const block of blocks) {
    const code =
      getXmlTag(block, "ITEM_ID") ||
      getXmlTag(block, "ITEMID");

    if (!code) continue;

    const priceVat = parsePrice(getXmlTag(block, "PRICE_VAT"));
    if (!Number.isFinite(priceVat)) continue;

    items[code] = {
      priceVat,
      product: getXmlTag(block, "PRODUCT"),
      productNo: getXmlTag(block, "PRODUCTNO")
    };
  }

  return items;
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      ...extraHeaders
    }
  });
}

function cachePayloadResponse(payload) {
  return jsonResponse(payload, 200, {
    // Cache API keeps the last successful snapshot much longer than the daily refresh interval.
    // The Worker itself decides after 24 h that it should try a refresh.
    "Cache-Control": `public, s-maxage=${STALE_RETENTION_SECONDS}`,
    "X-Price-Cache": "stored"
  });
}

async function fetchFreshPrices() {
  const response = await fetch(FEED_URL, {
    headers: {
      "Accept": "application/xml,text/xml,*/*"
    }
  });

  if (!response.ok) {
    throw new Error(`AV Integra feed HTTP ${response.status}`);
  }

  const xml = await response.text();
  const items = parseFeed(xml);
  const count = Object.keys(items).length;

  // Protect against accidentally caching an empty/invalid feed.
  if (count < 10) {
    throw new Error(`AV Integra feed obsahuje jen ${count} platných položek`);
  }

  return {
    updatedAt: new Date().toISOString(),
    source: "AV Integra",
    count,
    items
  };
}

async function handlePrices(request, ctx) {
  const cache = caches.default;
  const cacheUrl = new URL(request.url);
  cacheUrl.pathname = "/__internal/price-snapshot-v1";
  cacheUrl.search = "";
  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });

  const cachedResponse = await cache.match(cacheKey);
  let cachedPayload = null;

  if (cachedResponse) {
    try {
      cachedPayload = await cachedResponse.clone().json();
    } catch (_) {
      cachedPayload = null;
    }
  }

  const updatedMs = Date.parse(cachedPayload?.updatedAt || "");
  const cacheAgeMs = Number.isFinite(updatedMs) ? Date.now() - updatedMs : Infinity;

  // Fresh enough: return immediately.
  if (cachedPayload && cacheAgeMs < REFRESH_AFTER_MS) {
    return jsonResponse(cachedPayload, 200, {
      "Cache-Control": "no-store",
      "X-Price-Cache": "fresh"
    });
  }

  // Older than 24 h (or no snapshot): try to refresh.
  try {
    const freshPayload = await fetchFreshPrices();
    const storedResponse = cachePayloadResponse(freshPayload);
    ctx.waitUntil(cache.put(cacheKey, storedResponse.clone()));

    return jsonResponse(freshPayload, 200, {
      "Cache-Control": "no-store",
      "X-Price-Cache": cachedPayload ? "refreshed" : "miss"
    });
  } catch (error) {
    // Critical behavior: if the feed fails, do NOT throw away yesterday's prices.
    if (cachedPayload) {
      return jsonResponse(cachedPayload, 200, {
        "Cache-Control": "no-store",
        "X-Price-Cache": "stale",
        "X-Price-Refresh-Error": String(error?.message || error).slice(0, 180)
      });
    }

    return jsonResponse({
      error: "Cenový feed není momentálně dostupný a zatím neexistuje uložená cenová kopie."
    }, 503, {
      "Cache-Control": "no-store"
    });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/prices") {
      if (request.method !== "GET") {
        return jsonResponse({ error: "Method not allowed" }, 405, {
          "Allow": "GET"
        });
      }
      return handlePrices(request, ctx);
    }

    if (url.pathname.startsWith("/api/")) {
      return jsonResponse({ error: "Not found" }, 404);
    }

    return env.ASSETS.fetch(request);
  }
};
