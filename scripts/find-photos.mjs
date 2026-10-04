// Searches Wikimedia Commons for candidate photos per slot and writes a contact sheet to inspect.
// Usage: node scripts/find-photos.mjs <outDir> "<slot>=<query>" ...
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [outDir, ...slots] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const UA = "RYPP-landing-page/1.0 (local development; contact: d2digitechofficial@gmail.com)";
const OK = /^(CC0|CC BY(-SA)? [\d.]+|CC BY(-SA)?|Public domain|PD|Unsplash)/i;

const strip = (s = "") => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();

async function search(query, limit = 14) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  Object.entries({
    action: "query", format: "json", generator: "search", gsrnamespace: "6", gsrsearch: `${query} filetype:bitmap`, gsrlimit: String(limit),
    prop: "imageinfo", iiprop: "url|size|mime|extmetadata", iiurlwidth: "420", iiextmetadatafilter: "LicenseShortName|Artist|ImageDescription",
  }).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u, { headers: { "User-Agent": UA } });
  const j = await r.json();
  const pages = Object.values(j.query?.pages ?? {}).sort((a, b) => a.index - b.index);
  return pages
    .map((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii || !/jpe?g|png/.test(ii.mime)) return null;
      const lic = ii.extmetadata?.LicenseShortName?.value ?? "";
      return { title: p.title, w: ii.width, h: ii.height, lic, artist: strip(ii.extmetadata?.Artist?.value), thumb: ii.thumburl, url: ii.url };
    })
    .filter((x) => x && OK.test(x.lic) && x.w >= Number(process.env.MINW ?? 1000));
}

for (const spec of slots) {
  const [slot, query] = spec.split("=");
  const res = await search(query);
  console.log(`\n## ${slot}  (${query})`);
  const tiles = [];
  for (let i = 0; i < res.length; i++) {
    const c = res[i];
    console.log(`${i}. ${c.title} | ${c.w}x${c.h} | ${c.lic} | ${c.artist.slice(0, 40)}`);
    try {
      const b = Buffer.from(await (await fetch(c.thumb, { headers: { "User-Agent": UA } })).arrayBuffer());
      const t = await sharp(b).resize(300, 200, { fit: "cover" }).toBuffer();
      const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="30" height="22" fill="#000"/><text x="6" y="16" font-size="15" fill="#fff" font-family="Arial">${i}</text></svg>`);
      tiles.push({ input: await sharp(t).composite([{ input: label }]).png().toBuffer(), left: (i % 4) * 300, top: Math.floor(i / 4) * 200 });
    } catch (e) {
      console.log("   thumb failed", e.message);
    }
  }
  if (tiles.length) {
    const rows = Math.ceil(res.length / 4);
    await sharp({ create: { width: 1200, height: rows * 200, channels: 3, background: "#222" } }).composite(tiles).png().toFile(path.join(outDir, `${slot}.png`));
  }
  writeFileSync(path.join(outDir, `${slot}.json`), JSON.stringify(res, null, 1));
}
