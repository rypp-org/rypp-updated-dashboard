// Downloads the chosen Wikimedia Commons photos into public/images/photos and writes CREDITS.md.
// Usage: node scripts/fetch-photos.mjs <candidatesDir>   (candidatesDir = output of find-photos.mjs)
// The selection below was made by eye from the candidate contact sheets.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "images", "photos");
mkdirSync(OUT, { recursive: true });
const cands = process.argv[2];
const UA = "RYPP-landing-page/1.0 (local development; contact: d2digitechofficial@gmail.com)";

// [output name, candidate slot, index, max width]
const selection = [
  ["banner-sunset", "sunset_a", 8, 2000],
  ["vision", "sun_f", 0, 1600],
  ["cta", "sun_e", 0, 2000],
  ["red-mountains", "dest_manali", 4, 1400],
  ["cat-bikes", "v_himalayan", 6, 1400],
  ["cat-scooters", "v_activa", 2, 1400],
  ["cat-cars", "v_thar", 7, 1400],
  ["dest-bengaluru", "dest_blr", 1, 900],
  ["dest-coorg", "dest_coorg", 3, 900],
  ["dest-goa", "dest_goa", 0, 900],
  ["dest-manali", "dest_manali", 3, 900],
  ["dest-rishikesh", "dest_rishi", 3, 900],
  ["dest-jaipur", "dest_jaipur", 0, 900],
  ["v-classic", "v_classic", 5, 800],
  ["v-duke", "v_duke", 3, 800],
  ["v-r15", "v_r15", 0, 800],
  ["v-activa", "v_activa", 13, 800],
  ["v-swift", "v_swift", 0, 800],
  ["v-creta", "v_creta", 2, 800],
  ["v-himalayan", "v_himalayan", 0, 800],
  ["v-jupiter", "v_jupiter", 0, 800],
  ["v-thar", "v_thar", 0, 800],
  ["v-xuv", "v_xuv", 7, 800],
];

// Commons serves resized copies at .../thumb/<a>/<ab>/<File>/<width>px-<File>
const thumbUrl = (url, w) => {
  const m = url.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/(\w\/\w\w)\/(.+)$/);
  return m ? `${m[1]}/thumb/${m[2]}/${m[3]}/${w}px-${m[3]}` : url;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const credits = [];
for (const [name, slot, idx, maxW] of selection) {
  const c = JSON.parse(readFileSync(path.join(cands, `${slot}.json`), "utf8"))[idx];
  // Commons only serves thumbnails at fixed widths; fall back to the original when it is smaller
  c.url = c.url.split("?")[0];
  const w = [500, 960, 1280, 1920, 3840].find((x) => x >= maxW);
  const src = w >= c.w ? c.url : thumbUrl(c.url, w);
  let buf;
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(src, { headers: { "User-Agent": UA } });
    if (r.ok) { buf = Buffer.from(await r.arrayBuffer()); break; }
    console.log(`  ${name}: HTTP ${r.status}, retrying`);
    await sleep(2500 * (attempt + 1));
  }
  if (!buf) throw new Error(`failed to download ${name}`);
  const file = `${name}.jpg`;
  await sharp(buf).rotate().resize({ width: maxW, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, file));
  const meta = await sharp(path.join(OUT, file)).metadata();
  console.log(`${file}  ${meta.width}x${meta.height}  <- ${c.title}`);
  credits.push({ file, title: c.title.replace(/^File:/, ""), artist: c.artist, license: c.lic, source: `https://commons.wikimedia.org/wiki/${encodeURIComponent(c.title.replace(/ /g, "_"))}` });
  await sleep(600);
}

writeFileSync(path.join(ROOT, "scripts", "photo-credits.json"), JSON.stringify(credits, null, 2));
const md =
  `# Photo credits\n\nPhotographs in \`public/images/photos\` come from Wikimedia Commons and are used under their\nCreative Commons / public-domain licences. Attribution (and share-alike where the licence requires it) applies.\n\n` +
  `| File | Work | Author | Licence |\n|---|---|---|---|\n` +
  credits.map((c) => `| ${c.file} | [${c.title}](${c.source}) | ${c.artist.replace(/\|/g, "/").slice(0, 80)} | ${c.license} |`).join("\n") +
  `\n`;
writeFileSync(path.join(ROOT, "public", "images", "photos", "CREDITS.md"), md);
console.log("credits written; existing:", existsSync(path.join(OUT, "CREDITS.md")));
