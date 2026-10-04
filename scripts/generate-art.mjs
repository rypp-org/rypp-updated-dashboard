// Generates the illustrated artwork used by the landing page into /public/images.
// Run with: node scripts/generate-art.mjs
// Every file can be swapped for a real photo later (see app/_lib/images.ts).
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------ utils */
const rand = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const f = (n) => Number(n.toFixed(1));
let uid = 0;
const nid = (p = "g") => `${p}${++uid}`;

class Scene {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.defs = "";
    this.body = "";
  }
  def(s) {
    this.defs += s;
  }
  add(s) {
    this.body += s;
  }
  toString(par = "xMidYMid slice") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${this.h}" preserveAspectRatio="${par}"><defs>${this.defs}</defs>${this.body}</svg>`;
  }
}

const write = (name, svg) => writeFileSync(path.join(OUT, name), svg);

const vGrad = (id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ""}/>`)
    .join("")}</linearGradient>`;

function sky(S, stops) {
  const id = nid("sky");
  S.def(vGrad(id, stops));
  S.add(`<rect width="${S.w}" height="${S.h}" fill="url(#${id})"/>`);
}

function glow(S, cx, cy, r, color, op = 0.9) {
  const id = nid("glow");
  S.def(
    `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`,
  );
  S.add(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`);
}

/** ridge line points; sharp = alpine peaks, otherwise rolling hills */
function ridgePts(w, base, amp, seed, { step = 20, sharp = true } = {}) {
  const r = rand(seed);
  const p1 = r() * 6, p2 = r() * 6, p3 = r() * 6;
  const k1 = 1.4 + r() * 1.4, k2 = 3 + r() * 2.5;
  const pts = [];
  for (let x = -step; x <= w + step * 2; x += step) {
    const t = x / w;
    let v;
    if (sharp) {
      v =
        0.62 * (1 - Math.abs(Math.sin(t * Math.PI * k1 + p1))) +
        0.28 * (1 - Math.abs(Math.sin(t * Math.PI * k2 + p2))) +
        0.1 * r();
    } else {
      v = 0.55 + 0.3 * Math.sin(t * Math.PI * k1 + p1) + 0.15 * Math.sin(t * Math.PI * k2 + p3);
      v = v * 0.9 + 0.1 * r();
    }
    pts.push([x, base - amp * v]);
  }
  return pts;
}
function polyPath(pts, h) {
  return `M${pts[0][0]} ${h} L${pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(" L")} L${pts[pts.length - 1][0]} ${h} Z`;
}
function smoothPath(pts, h) {
  let d = `M${pts[0][0]} ${h} L${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q${f(pts[i][0])} ${f(pts[i][1])} ${f(mx)} ${f(my)}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L${last[0]} ${h} Z`;
}

/** a mountain layer; snow: colour of the snow cap or null */
function mountains(S, { base, amp, seed, color, snow = null, snowDepth = 0.4, sharp = true, step, bottom, opacity = 1 }) {
  const h = bottom ?? S.h;
  const pts = ridgePts(S.w, base, amp, seed, { step: step ?? (sharp ? 22 : 30), sharp });
  const id = nid("m");
  const top = base - amp;
  S.def(
    snow
      ? `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(top)}" x2="0" y2="${f(base + amp * 0.1)}"><stop offset="0" stop-color="${snow}"/><stop offset="${snowDepth}" stop-color="${snow}"/><stop offset="${snowDepth + 0.14}" stop-color="${color}"/><stop offset="1" stop-color="${color}"/></linearGradient>`
      : `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${f(top)}" x2="0" y2="${h}"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity=".85"/></linearGradient>`,
  );
  S.add(`<path d="${sharp ? polyPath(pts, h) : smoothPath(pts, h)}" fill="url(#${id})" opacity="${opacity}"/>`);
  return pts;
}

function haze(S, y, height, color, op = 0.6) {
  const id = nid("hz");
  S.def(vGrad(id, [[0, color, 0], [0.5, color, op], [1, color, 0]]));
  S.add(`<rect x="0" y="${y}" width="${S.w}" height="${height}" fill="url(#${id})"/>`);
}

function pines(S, { x0, x1, y, h, color, seed, n, spread = 0 }) {
  const r = rand(seed);
  let d = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + (x1 - x0) * r();
    const s = h * (0.6 + r() * 0.8);
    const yy = y + (r() - 0.5) * spread;
    const w = s * 0.42;
    d += `M${f(x)} ${f(yy - s)}L${f(x + w * 0.5)} ${f(yy - s * 0.6)}L${f(x + w * 0.3)} ${f(yy - s * 0.6)}L${f(x + w * 0.7)} ${f(yy - s * 0.28)}L${f(x + w * 0.4)} ${f(yy - s * 0.28)}L${f(x + w)} ${f(yy)}L${f(x - w)} ${f(yy)}L${f(x - w * 0.4)} ${f(yy - s * 0.28)}L${f(x - w * 0.7)} ${f(yy - s * 0.28)}L${f(x - w * 0.3)} ${f(yy - s * 0.6)}L${f(x - w * 0.5)} ${f(yy - s * 0.6)}Z`;
  }
  S.add(`<path d="${d}" fill="${color}"/>`);
}

function roundTrees(S, { x0, x1, y, r: rad, color, seed, n, light }) {
  const r = rand(seed);
  let out = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + (x1 - x0) * r();
    const s = rad * (0.7 + r() * 0.6);
    out += `<rect x="${f(x - s * 0.08)}" y="${f(y - s * 0.6)}" width="${f(s * 0.16)}" height="${f(s * 0.7)}" fill="#3b2a1e"/><circle cx="${f(x)}" cy="${f(y - s * 1.2)}" r="${f(s)}" fill="${color}"/>`;
    if (light) out += `<circle cx="${f(x - s * 0.3)}" cy="${f(y - s * 1.4)}" r="${f(s * 0.55)}" fill="${light}" opacity=".55"/>`;
  }
  S.add(out);
}

/** perspective road ribbon; returns nothing, draws into the scene */
function road(S, { x0, widthBottom, horizonY, vx, curve = 0, color = "#3a3d44", edge = "#8b8f97", line = "#f2f2f2", lineOp = 0.85 }) {
  const N = 70;
  const pt = (i) => {
    const t = i / N;
    const y = S.h - (S.h - horizonY) * Math.pow(t, 0.72);
    const w = widthBottom * Math.pow(1 - t, 1.9) + 3;
    const x = x0 + (vx - x0) * Math.pow(t, 0.85) + curve * Math.sin(t * Math.PI * 1.35) * (1 - t * 0.55);
    return { x, y, w };
  };
  const L = [], R = [];
  for (let i = 0; i <= N; i++) {
    const p = pt(i);
    L.push(`${f(p.x - p.w / 2)} ${f(p.y)}`);
    R.push(`${f(p.x + p.w / 2)} ${f(p.y)}`);
  }
  const shape = `M${L.join(" L")} L${R.reverse().join(" L")} Z`;
  S.add(`<path d="${shape}" fill="${color}"/>`);
  // edges
  let e = "";
  for (let i = 0; i < N; i++) {
    const a = pt(i), b = pt(i + 1);
    const ea = a.w * 0.045 + 0.4, eb = b.w * 0.045 + 0.4;
    e += `M${f(a.x - a.w / 2)} ${f(a.y)}L${f(b.x - b.w / 2)} ${f(b.y)}L${f(b.x - b.w / 2 + eb)} ${f(b.y)}L${f(a.x - a.w / 2 + ea)} ${f(a.y)}Z`;
    e += `M${f(a.x + a.w / 2)} ${f(a.y)}L${f(b.x + b.w / 2)} ${f(b.y)}L${f(b.x + b.w / 2 - eb)} ${f(b.y)}L${f(a.x + a.w / 2 - ea)} ${f(a.y)}Z`;
  }
  S.add(`<path d="${e}" fill="${edge}" opacity=".7"/>`);
  let d = "";
  for (let i = 0; i < N; i += 4) {
    const a = pt(i), b = pt(Math.min(N, i + 2));
    const wa = a.w * 0.025 + 0.3, wb = b.w * 0.025 + 0.3;
    d += `M${f(a.x - wa)} ${f(a.y)}L${f(b.x - wb)} ${f(b.y)}L${f(b.x + wb)} ${f(b.y)}L${f(a.x + wa)} ${f(a.y)}Z`;
  }
  S.add(`<path d="${d}" fill="${line}" opacity="${lineOp}"/>`);
}

/* --------------------------------------------------------------- vehicles */
function wheel(cx, cy, r, rim = "#cfd4db") {
  let spokes = "";
  for (let a = 0; a < 180; a += 30) {
    const rad = (a * Math.PI) / 180;
    const dx = Math.cos(rad) * r * 0.6, dy = Math.sin(rad) * r * 0.6;
    spokes += `<line x1="${f(cx - dx)}" y1="${f(cy - dy)}" x2="${f(cx + dx)}" y2="${f(cy + dy)}"/>`;
  }
  return `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="#14171b"/><circle cx="${cx}" cy="${cy}" r="${f(r * 0.74)}" fill="#262b32"/><circle cx="${cx}" cy="${cy}" r="${f(r * 0.6)}" fill="none" stroke="${rim}" stroke-width="${f(r * 0.08)}"/><g stroke="${rim}" stroke-width="${f(r * 0.04)}" opacity=".85">${spokes}</g><circle cx="${cx}" cy="${cy}" r="${f(r * 0.13)}" fill="#8f97a3"/></g>`;
}

/** motorcycle facing right. Local box ~ x 20..375, y 40..245, ground y=243 */
function bike({ body, accent = "#111", style = "cruiser", rider = false, jacket = "#2c3038", helmet = "#d3202a" }) {
  let s = `<ellipse cx="200" cy="244" rx="185" ry="7" fill="#000" opacity=".2"/>`;
  s += `<path d="M175 184 L70 172 L60 181 L172 196Z" fill="#c9ced6"/><path d="M60 181 L52 178 L54 170 L68 172Z" fill="#8c929b"/>`;
  s += `<line x1="150" y1="182" x2="88" y2="192" stroke="#20242a" stroke-width="8" stroke-linecap="round"/>`;
  s += wheel(88, 192, 50) + wheel(318, 192, 50);
  // engine
  s += `<path d="M148 138 L242 138 L248 192 L160 196Z" fill="#3a3f47"/><g stroke="#2a2e35" stroke-width="3"><line x1="156" y1="150" x2="240" y2="150"/><line x1="156" y1="160" x2="242" y2="160"/><line x1="158" y1="170" x2="244" y2="170"/></g><circle cx="200" cy="178" r="13" fill="#5a606a"/><circle cx="200" cy="178" r="6" fill="#20242a"/>`;
  // rear shock
  s += `<line x1="128" y1="122" x2="112" y2="178" stroke="#e0a326" stroke-width="6" stroke-linecap="round"/>`;
  if (style === "cruiser") {
    s += `<path d="M36 170 C40 126 104 116 142 152" fill="none" stroke="${body}" stroke-width="9" stroke-linecap="round"/>`;
    s += `<path d="M76 120 C100 106 140 108 156 114 L154 130 L80 132Z" fill="#1b1b1e"/>`;
    s += `<path d="M148 114 C168 86 236 84 264 108 L260 130 C230 142 170 142 146 132Z" fill="${body}"/><path d="M160 108 C190 96 232 96 252 108" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>`;
    s += `<path d="M282 168 C302 140 348 140 366 168" fill="none" stroke="${body}" stroke-width="9" stroke-linecap="round"/>`;
    s += `<line x1="318" y1="192" x2="280" y2="106" stroke="#cfd4da" stroke-width="7" stroke-linecap="round"/><line x1="326" y1="192" x2="288" y2="106" stroke="#8f959e" stroke-width="3" stroke-linecap="round"/>`;
    s += `<path d="M280 98 L262 88 L244 92" fill="none" stroke="#22252a" stroke-width="6" stroke-linecap="round"/>`;
    s += `<circle cx="296" cy="114" r="17" fill="#dfe3e8"/><circle cx="298" cy="114" r="11" fill="#fff6c8"/><circle cx="296" cy="114" r="17" fill="none" stroke="#9aa0a9" stroke-width="3"/>`;
  } else if (style === "naked") {
    s += `<path d="M44 140 L62 118 L152 110 L154 130 L96 134Z" fill="${accent}"/>`;
    s += `<path d="M98 108 L154 106 L154 118 L96 122Z" fill="#141416"/>`;
    s += `<path d="M148 108 L236 94 L266 118 L244 134 L154 132Z" fill="${body}"/><path d="M236 94 L266 118 L252 122 L228 100Z" fill="#000" opacity=".18"/>`;
    s += `<g stroke="${accent}" stroke-width="5" stroke-linecap="round"><line x1="154" y1="134" x2="262" y2="112"/><line x1="160" y1="132" x2="160" y2="186"/><line x1="250" y1="126" x2="246" y2="186"/></g>`;
    s += `<path d="M290 140 C300 130 340 132 360 162" fill="none" stroke="#141416" stroke-width="8" stroke-linecap="round"/>`;
    s += `<line x1="318" y1="192" x2="284" y2="98" stroke="#e0a326" stroke-width="7" stroke-linecap="round"/>`;
    s += `<path d="M282 92 L262 86 L246 90" fill="none" stroke="#22252a" stroke-width="6" stroke-linecap="round"/>`;
    s += `<path d="M268 84 L302 92 L306 116 L282 120Z" fill="${body}"/><path d="M284 96 L302 100 L303 110 L286 112Z" fill="#fff6c8"/>`;
  } else {
    s += `<path d="M40 138 L62 114 L152 108 L154 130 L90 134Z" fill="${body}"/><path d="M48 138 L64 120 L98 116 L94 130Z" fill="${accent}" opacity=".9"/>`;
    s += `<path d="M96 106 L154 104 L154 116 L94 120Z" fill="#141416"/>`;
    s += `<path d="M148 106 L240 98 L262 118 L242 132 L152 130Z" fill="${body}"/>`;
    s += `<path d="M172 152 L256 152 L236 198 L182 198Z" fill="${accent}"/>`;
    s += `<line x1="318" y1="192" x2="292" y2="112" stroke="#cfd4da" stroke-width="7" stroke-linecap="round"/>`;
    s += `<path d="M262 82 L300 98 L346 134 L342 154 L282 152 L250 122Z" fill="${body}"/><path d="M262 82 L300 98 L346 134 L330 130 L286 106Z" fill="#fff" opacity=".22"/>`;
    s += `<path d="M262 82 L288 60 L300 88Z" fill="#7fb6e6" opacity=".85"/>`;
    s += `<path d="M300 112 L322 122 L318 134 L296 128Z" fill="#fff6c8"/><path d="M270 132 L300 138 L330 150 L282 150Z" fill="${accent}"/>`;
    s += `<path d="M256 96 L240 92" stroke="#22252a" stroke-width="6" stroke-linecap="round"/>`;
  }
  if (rider) {
    // stylised rider: boots, thigh, torso, arms, backpack, helmet
    s += `<line x1="196" y1="176" x2="222" y2="130" stroke="#1d2026" stroke-width="16" stroke-linecap="round"/>`;
    s += `<path d="M186 172 L214 172 L216 184 L182 184Z" fill="#111"/>`;
    s += `<line x1="132" y1="112" x2="216" y2="128" stroke="#23262c" stroke-width="24" stroke-linecap="round"/>`;
    s += `<rect x="112" y="40" width="42" height="56" rx="14" fill="#c92a2a" transform="rotate(-18 133 68)"/><rect x="120" y="48" width="26" height="20" rx="6" fill="#a61e1e" transform="rotate(-18 133 68)"/>`;
    s += `<line x1="140" y1="108" x2="232" y2="52" stroke="${jacket}" stroke-width="36" stroke-linecap="round"/>`;
    s += `<line x1="236" y1="58" x2="264" y2="92" stroke="#1c1f24" stroke-width="15" stroke-linecap="round"/><circle cx="266" cy="94" r="8" fill="#111"/>`;
    s += `<circle cx="252" cy="26" r="25" fill="${helmet}"/><path d="M256 12 C276 12 282 30 278 40 L252 40 C250 28 250 18 256 12Z" fill="#14161a"/><path d="M232 36 C230 22 240 6 256 5" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="4" stroke-linecap="round"/>`;
    s += `<rect x="238" y="46" width="24" height="12" rx="5" fill="#20242a"/>`;
  }
  return { w: 400, h: 250, vb: "10 30 380 220", inner: s, ground: 243 };
}

/** scooter facing right, ground y=236 */
function scooter({ body, accent = "#222" }) {
  let s = `<ellipse cx="205" cy="238" rx="175" ry="7" fill="#000" opacity=".2"/>`;
  s += `<rect x="62" y="176" width="86" height="12" rx="5" fill="#b7bcc4"/>`;
  s += wheel(94, 200, 36) + wheel(314, 200, 36);
  s += `<path d="M46 142 C48 98 112 84 172 92 L200 98 L202 152 L150 170 L96 178 C64 172 44 162 46 142Z" fill="${body}"/>`;
  s += `<path d="M60 130 C70 106 120 96 168 102" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>`;
  s += `<rect x="196" y="168" width="70" height="14" rx="5" fill="#2b2f36"/>`;
  s += `<path d="M96 88 C124 72 178 72 202 88 L200 100 L98 104Z" fill="#1b1b1e"/>`;
  s += `<path d="M252 178 L264 100 C268 90 282 82 292 88 L300 100 L292 180Z" fill="${body}"/><path d="M270 110 L284 100" stroke="${accent}" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
  s += `<line x1="314" y1="200" x2="286" y2="86" stroke="#cfd4da" stroke-width="7" stroke-linecap="round"/>`;
  s += `<path d="M268 76 L300 70" stroke="#23262b" stroke-width="7" stroke-linecap="round"/><path d="M272 72 L280 50" stroke="#23262b" stroke-width="4" stroke-linecap="round"/>`;
  s += `<path d="M292 78 C312 78 316 98 300 104 L292 100Z" fill="${body}"/><circle cx="304" cy="92" r="8" fill="#fff6c8"/>`;
  s += `<path d="M284 172 C296 150 336 150 350 172" fill="none" stroke="${body}" stroke-width="8" stroke-linecap="round"/>`;
  s += `<path d="M58 182 L140 184 L142 196 L60 196Z" fill="#c9ced6"/>`;
  return { w: 400, h: 250, vb: "20 50 350 195", inner: s, ground: 237 };
}

/** car facing right: kind hatch | suv | boxy */
function car({ body, kind = "suv", accent = "#161a1f" }) {
  const gid = nid("gl");
  const glass = `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe6f5"/><stop offset="1" stop-color="#6f93ad"/></linearGradient>`;
  const gloss = nid("gs");
  const glossDef = `<linearGradient id="${gloss}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>`;
  let s = `<defs>${glass}${glossDef}</defs>`;
  let cy, r, top, bodyPath, wins, extra = "";
  if (kind === "hatch") {
    cy = 168; r = 36;
    bodyPath = "M18 158 L20 128 C22 112 44 108 84 104 L128 100 C146 74 172 56 206 54 L308 54 C330 54 344 64 358 82 L372 98 C420 102 452 112 460 132 L462 152 C462 158 456 162 448 162 L22 162 C18 162 18 160 18 158Z";
    wins = `<path d="M150 100 C162 78 180 66 206 64 L232 64 L232 100Z" fill="url(#${gid})"/><path d="M242 64 L306 64 C320 64 330 72 342 88 L350 100 L242 100Z" fill="url(#${gid})"/>`;
    extra = `<path d="M436 116 L458 122 L458 134 L432 132Z" fill="#fff6c8"/><rect x="18" y="116" width="10" height="16" rx="3" fill="#c81e1e"/><rect x="26" y="150" width="424" height="12" fill="${accent}" opacity=".85"/><path d="M420 138 L460 142 L460 154 L416 152Z" fill="${accent}" opacity=".9"/>`;
    top = 54;
  } else if (kind === "boxy") {
    cy = 172; r = 40;
    bodyPath = "M22 164 L22 84 C22 74 30 70 40 70 L60 70 L64 44 L318 44 L322 88 L446 92 C458 94 464 100 464 112 L466 160 C466 166 460 170 452 170 L28 170 C24 170 22 168 22 164Z";
    wins = `<path d="M76 54 L188 54 L188 92 L72 92Z" fill="url(#${gid})"/><path d="M198 54 L308 54 L312 92 L198 92Z" fill="url(#${gid})"/>`;
    extra = `<rect x="400" y="104" width="62" height="40" rx="4" fill="${accent}"/><g stroke="#8b929c" stroke-width="3"><line x1="412" y1="106" x2="412" y2="142"/><line x1="424" y1="106" x2="424" y2="142"/><line x1="436" y1="106" x2="436" y2="142"/><line x1="448" y1="106" x2="448" y2="142"/></g><circle cx="386" cy="112" r="10" fill="#fff6c8"/><rect x="22" y="100" width="8" height="24" fill="#c81e1e"/><rect x="24" y="156" width="440" height="14" fill="${accent}" opacity=".9"/><path d="M52 40 L322 40" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`;
    top = 40;
  } else {
    cy = 172; r = 40;
    bodyPath = "M16 160 L18 118 C20 104 34 100 62 98 L100 96 L128 56 C134 46 146 42 158 42 L330 42 C346 42 356 48 364 60 L384 92 C426 98 456 108 462 128 L464 158 C464 164 458 168 450 168 L24 168 C18 168 16 165 16 160Z";
    wins = `<path d="M138 92 L156 60 L232 60 L232 92Z" fill="url(#${gid})"/><path d="M242 60 L330 60 C338 60 342 64 348 72 L364 92 L242 92Z" fill="url(#${gid})"/>`;
    extra = `<path d="M150 38 L340 38" stroke="${accent}" stroke-width="5" stroke-linecap="round"/><rect x="434" y="116" width="28" height="34" rx="4" fill="${accent}"/><g stroke="#aab0b8" stroke-width="2.5"><line x1="436" y1="124" x2="460" y2="124"/><line x1="436" y1="132" x2="460" y2="132"/><line x1="436" y1="140" x2="460" y2="140"/></g><path d="M414 108 L440 112 L440 122 L410 118Z" fill="#fff6c8"/><rect x="16" y="110" width="10" height="22" rx="3" fill="#c81e1e"/><rect x="24" y="154" width="430" height="14" fill="${accent}" opacity=".85"/><path d="M428 150 L462 152 L462 164 L424 164Z" fill="#9aa1ab"/>`;
    top = 38;
  }
  const bottom = cy + r;
  s += `<ellipse cx="240" cy="${bottom + 1}" rx="230" ry="8" fill="#000" opacity=".22"/>`;
  s += `<path d="${bodyPath}" fill="${body}"/><path d="${bodyPath}" fill="url(#${gloss})"/>`;
  s += wins;
  s += `<path d="M236 ${kind === "boxy" ? 92 : 100} L236 ${cy - 12}" stroke="#000" stroke-opacity=".28" stroke-width="2.5"/><rect x="204" y="${cy - 52}" width="22" height="5" rx="2.5" fill="#000" opacity=".35"/>`;
  s += extra;
  const ax1 = 110, ax2 = 370;
  s += `<path d="M${ax1 - r - 8} ${cy} A${r + 8} ${r + 8} 0 0 1 ${ax1 + r + 8} ${cy}Z" fill="#0d0f12"/><path d="M${ax2 - r - 8} ${cy} A${r + 8} ${r + 8} 0 0 1 ${ax2 + r + 8} ${cy}Z" fill="#0d0f12"/>`;
  s += wheel(ax1, cy, r, "#d7dbe1") + wheel(ax2, cy, r, "#d7dbe1");
  // mirror
  s += `<path d="M${kind === "hatch" ? 352 : 366} ${kind === "hatch" ? 94 : 96} l16 -2 l-2 12 l-14 0z" fill="${body}"/>`;
  return { w: 480, h: 230, vb: `4 ${top - 8} 470 ${bottom - top + 16}`, inner: s, ground: bottom };
}

const place = (v, x, groundY, scale) => `<g transform="translate(${f(x)} ${f(groundY - v.ground * scale)}) scale(${scale})">${v.inner}</g>`;
const standalone = (v) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${v.vb}">${v.inner}</svg>`;

/* --------------------------------------------------------------- vehicles */
const V = {
  classic: bike({ body: "#1d1d20", accent: "#8b1d1d", style: "cruiser" }),
  duke: bike({ body: "#f26a1b", accent: "#1c1c1f", style: "naked" }),
  r15: bike({ body: "#1c4fd8", accent: "#0c1f5c", style: "fairing" }),
  himalayan: bike({ body: "#dfe3e6", accent: "#2f6f5e", style: "cruiser" }),
  activa: scooter({ body: "#2b2d31", accent: "#8b1d1d" }),
  jupiter: scooter({ body: "#c1121f", accent: "#111" }),
  access: scooter({ body: "#e9edf1", accent: "#1c4fd8" }),
  swift: car({ body: "#f1f3f5", kind: "hatch" }),
  creta: car({ body: "#f4f5f7", kind: "suv" }),
  thar: car({ body: "#c7461f", kind: "boxy" }),
  xuv: car({ body: "#2a3138", kind: "suv" }),
};
for (const [name, v] of Object.entries(V)) {
  const prefix = name.match(/classic|duke|r15|himalayan/) ? "bike" : name.match(/activa|jupiter|access/) ? "scooter" : "car";
  write(`v-${prefix}-${name}.svg`, standalone(v));
}

/* ----------------------------------------------------------- landscapes */
function alpineDay(S, { horizon, seed = 1 }) {
  // sky + layered mountains used for hero and category cards
  sky(S, [
    [0, "#7fb8e8"],
    [0.45, "#bfe0f5"],
    [0.75, "#eaf5fb"],
    [1, "#ffffff"],
  ]);
  glow(S, S.w * 0.72, S.h * 0.14, S.h * 0.5, "#ffffff", 0.75);
  mountains(S, { base: horizon - 10, amp: S.h * 0.44, seed: seed + 2, color: "#8fa7c4", snow: "#ffffff", snowDepth: 0.45 });
  haze(S, horizon - S.h * 0.22, S.h * 0.28, "#dbeafa", 0.55);
  mountains(S, { base: horizon + S.h * 0.06, amp: S.h * 0.3, seed: seed + 5, color: "#5f8794", snow: "#f1f6fa", snowDepth: 0.22 });
  mountains(S, { base: horizon + S.h * 0.14, amp: S.h * 0.2, seed: seed + 9, color: "#3f7a55", sharp: false });
  pines(S, { x0: 0, x1: S.w, y: horizon + S.h * 0.2, h: S.h * 0.11, color: "#1d4a2c", seed: seed + 11, n: 70, spread: S.h * 0.04 });
  mountains(S, { base: horizon + S.h * 0.26, amp: S.h * 0.14, seed: seed + 13, color: "#2f6a3c", sharp: false });
}

// HERO ---------------------------------------------------------------
{
  const S = new Scene(1400, 780);
  alpineDay(S, { horizon: 400, seed: 3 });
  road(S, { x0: 760, widthBottom: 1500, horizonY: 470, vx: 1010, curve: -120, color: "#484b52", edge: "#c5c8ce" });
  pines(S, { x0: 0, x1: 420, y: 700, h: 120, color: "#153a22", seed: 21, n: 9, spread: 90 });
  pines(S, { x0: 1180, x1: 1400, y: 560, h: 70, color: "#173f26", seed: 22, n: 8, spread: 40 });
  S.add(place(bike({ body: "#1d1d20", accent: "#8b1d1d", style: "cruiser", rider: true }), 340, 728, 1.34));
  S.add(place(car({ body: "#f5f6f8", kind: "suv" }), 905, 738, 0.9));
  write("hero.svg", S.toString());
}

// CATEGORY CARDS -----------------------------------------------------
{
  const mk = (name, seed, vehicle, sc, gx, gy) => {
    const S = new Scene(640, 440);
    alpineDay(S, { horizon: 220, seed });
    road(S, { x0: 330, widthBottom: 900, horizonY: 300, vx: 400, curve: -40, color: "#4a4d54", edge: "#c5c8ce" });
    S.add(place(vehicle, gx, gy, sc));
    write(name, S.toString());
  };
  mk("cat-bikes.svg", 31, bike({ body: "#1d1d20", accent: "#8b1d1d", style: "cruiser" }), 0.98, 110, 392);
  mk("cat-scooters.svg", 41, scooter({ body: "#eef1f4", accent: "#c1121f" }), 1.02, 130, 392);
  mk("cat-cars.svg", 51, car({ body: "#f5f6f8", kind: "suv" }), 0.9, 90, 396);
}

// SUNSET SCENES ------------------------------------------------------
function sunset(name, { seed, sunX, w = 1600, h = 440, warm = 1, roadX = 0 }) {
  const S = new Scene(w, h);
  const hz = h * 0.6;
  sky(S, [
    [0, "#10141f"],
    [0.3, "#3a2a3e"],
    [0.55, warm ? "#b8533a" : "#6a4a60"],
    [0.72, "#f39c48"],
    [0.86, "#ffd47d"],
    [1, "#ffe7a8"],
  ]);
  glow(S, sunX, hz - 10, h * 0.9, "#ffb95a", 0.75);
  S.add(`<circle cx="${sunX}" cy="${f(hz - 12)}" r="${h * 0.07}" fill="#fff3c8"/>`);
  mountains(S, { base: hz + 6, amp: h * 0.32, seed: seed, color: "#4a3548", sharp: true, opacity: 0.95 });
  haze(S, hz - h * 0.2, h * 0.3, "#f6a25a", 0.35);
  mountains(S, { base: hz + 22, amp: h * 0.2, seed: seed + 4, color: "#2b2233", sharp: true });
  pines(S, { x0: 0, x1: w, y: hz + 40, h: h * 0.16, color: "#16121b", seed: seed + 6, n: 110, spread: h * 0.03 });
  mountains(S, { base: hz + 40, amp: h * 0.06, seed: seed + 8, color: "#1a1620", sharp: false });
  road(S, { x0: sunX - 120 + roadX, widthBottom: 1000, horizonY: hz + 34, vx: sunX, curve: -140, color: "#1b1720", edge: "#f0b565", line: "#f6c476", lineOp: 0.9 });
  pines(S, { x0: 0, x1: w * 0.36, y: h + 10, h: h * 0.4, color: "#0e0b12", seed: seed + 12, n: 12, spread: 30 });
  pines(S, { x0: w * 0.78, x1: w, y: h + 10, h: h * 0.36, color: "#0e0b12", seed: seed + 13, n: 9, spread: 30 });
  write(name, S.toString());
}
sunset("banner-sunset.svg", { seed: 61, sunX: 1080 });
sunset("vision.svg", { seed: 71, sunX: 760, w: 1000, h: 540, warm: 1 });
sunset("cta.svg", { seed: 81, sunX: 980 });

// RED MOUNTAINS (testimonial panel) ----------------------------------
{
  const S = new Scene(1000, 560);
  sky(S, [[0, "#e11b22"], [0.6, "#c1121f"], [1, "#8f0d17"]]);
  glow(S, 700, 120, 420, "#ff7a72", 0.5);
  mountains(S, { base: 330, amp: 300, seed: 91, color: "#b3121c", snow: "#ffb3ad", snowDepth: 0.3 });
  mountains(S, { base: 430, amp: 230, seed: 95, color: "#8f0d17", snow: "#e56a68", snowDepth: 0.2 });
  mountains(S, { base: 500, amp: 150, seed: 99, color: "#6f0a12", sharp: false });
  write("red-mountains.svg", S.toString());
}

/* ----------------------------------------------------------- destinations */
const DW = 480, DH = 440;

// Bengaluru -- Vidhana Soudha-style building
{
  const S = new Scene(DW, DH);
  sky(S, [[0, "#6fb2e6"], [1, "#cfe8f7"]]);
  glow(S, 380, 70, 200, "#fff", 0.7);
  S.add(`<rect y="330" width="${DW}" height="110" fill="#5c8f4a"/>`);
  // wings
  S.add(`<rect x="30" y="230" width="420" height="110" fill="#c9ad8a"/><rect x="30" y="222" width="420" height="12" fill="#e2cfb3"/>`);
  let win = "";
  for (let r = 0; r < 3; r++) for (let c = 0; c < 15; c++) {
    const x = 44 + c * 27;
    if (x > 176 && x < 296) continue;
    win += `<rect x="${x}" y="${246 + r * 28}" width="12" height="18" rx="6" fill="#6b4f3a"/>`;
  }
  S.add(win);
  // central block
  S.add(`<rect x="176" y="170" width="128" height="170" fill="#d8bd99"/><rect x="170" y="162" width="140" height="12" fill="#ead8bd"/>`);
  let col = "";
  for (let i = 0; i < 6; i++) col += `<rect x="${186 + i * 20}" y="196" width="9" height="122" fill="#f0e1c8"/>`;
  S.add(`<rect x="182" y="190" width="116" height="10" fill="#ead8bd"/>${col}<rect x="182" y="318" width="116" height="8" fill="#b89a74"/>`);
  S.add(`<path d="M190 162 C190 110 290 110 290 162Z" fill="#b8a07f"/><path d="M212 118 C212 82 268 82 268 118Z" fill="#c9b08e"/><rect x="238" y="56" width="4" height="34" fill="#4a3a2a"/><path d="M242 58 L262 64 L242 70Z" fill="#ff9933"/>`);
  S.add(`<path d="M150 340 L330 340 L360 440 L120 440Z" fill="#d9c7a8"/><g stroke="#c2ad8a" stroke-width="3"><line x1="140" y1="360" x2="340" y2="360"/><line x1="130" y1="385" x2="350" y2="385"/><line x1="122" y1="412" x2="358" y2="412"/></g>`);
  roundTrees(S, { x0: -10, x1: 120, y: 350, r: 44, color: "#2f6a35", light: "#4c8a4a", seed: 5, n: 4 });
  roundTrees(S, { x0: 360, x1: 490, y: 350, r: 44, color: "#2f6a35", light: "#4c8a4a", seed: 6, n: 4 });
  write("dest-bengaluru.svg", S.toString());
}

// Coorg -- misty green hills
{
  const S = new Scene(DW, DH);
  sky(S, [[0, "#b7dcc7"], [0.5, "#e6f3e2"], [1, "#f6fbef"]]);
  glow(S, 330, 90, 220, "#fffbe0", 0.8);
  mountains(S, { base: 230, amp: 130, seed: 111, color: "#7fb08a", sharp: false });
  haze(S, 150, 120, "#ffffff", 0.7);
  mountains(S, { base: 290, amp: 120, seed: 115, color: "#4f9560", sharp: false });
  haze(S, 230, 90, "#ffffff", 0.45);
  mountains(S, { base: 360, amp: 130, seed: 119, color: "#2f7a45", sharp: false });
  let terr = "";
  for (let i = 0; i < 7; i++) terr += `<path d="M-10 ${300 + i * 20} C120 ${280 + i * 20} 300 ${330 + i * 20} 500 ${300 + i * 20}" fill="none" stroke="#1f5c33" stroke-width="3" opacity=".55"/>`;
  S.add(terr);
  roundTrees(S, { x0: 20, x1: 460, y: 390, r: 14, color: "#1c5a2d", light: "#3f8a4f", seed: 12, n: 14 });
  mountains(S, { base: 460, amp: 90, seed: 123, color: "#215a30", sharp: false });
  S.add(`<path d="M-10 440 C120 400 220 420 300 380 C360 350 420 356 490 330 L490 440Z" fill="#c9a46a" opacity=".85"/>`);
  write("dest-coorg.svg", S.toString());
}

// Goa -- beach and palms
{
  const S = new Scene(DW, DH);
  sky(S, [[0, "#43b6dc"], [0.6, "#a9e0ee"], [1, "#e3f6f4"]]);
  glow(S, 360, 120, 200, "#fff8d0", 0.9);
  S.add(`<circle cx="360" cy="120" r="26" fill="#fff6c2"/>`);
  const sea = nid("sea");
  S.def(vGrad(sea, [[0, "#1aa7bd"], [1, "#0e7c96"]]));
  S.add(`<rect y="230" width="${DW}" height="110" fill="url(#${sea})"/>`);
  let waves = "";
  for (let i = 0; i < 9; i++) waves += `<path d="M${(i * 71) % 460} ${246 + (i % 4) * 22} q14 -6 28 0 t28 0" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>`;
  S.add(waves);
  S.add(`<path d="M0 330 C120 306 260 322 480 300 L480 440 L0 440Z" fill="#f2dba8"/><path d="M0 350 C150 330 300 350 480 322 L480 440 L0 440Z" fill="#e8c98a" opacity=".7"/><path d="M0 300 C160 322 300 316 480 296" fill="none" stroke="#fff" stroke-width="7" stroke-opacity=".8"/>`);
  const palm = (x, y, lean, hgt, seed) => {
    const r = rand(seed);
    let s = `<path d="M${x} ${y} Q${x + lean * 0.4} ${y - hgt * 0.55} ${x + lean} ${y - hgt}" fill="none" stroke="#6b4a2b" stroke-width="12" stroke-linecap="round"/>`;
    const tx = x + lean, ty = y - hgt;
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI + (i / 7) * Math.PI + (r() - 0.5) * 0.2;
      const len = 90 + r() * 30;
      const ex = tx + Math.cos(a) * len, ey = ty + Math.sin(a) * len * 0.5 + 34;
      s += `<path d="M${tx} ${ty} Q${f(tx + Math.cos(a) * len * 0.5)} ${f(ty - 34 + Math.sin(a) * 20)} ${f(ex)} ${f(ey)} Q${f(tx + Math.cos(a) * len * 0.5)} ${f(ty - 14 + Math.sin(a) * 20)} ${tx} ${ty}Z" fill="${i % 2 ? "#2f8f4a" : "#3aa257"}"/>`;
    }
    return s;
  };
  S.add(palm(96, 372, -20, 250, 3) + palm(190, 392, 40, 190, 7));
  S.add(`<rect x="300" y="330" width="90" height="46" fill="#b8763b"/><path d="M290 332 L345 296 L400 332Z" fill="#7a4a24"/>`);
  write("dest-goa.svg", S.toString());
}

// Manali -- snow peaks and pines
{
  const S = new Scene(DW, DH);
  sky(S, [[0, "#2f6fc0"], [0.5, "#79b3e6"], [1, "#d3e9f8"]]);
  mountains(S, { base: 300, amp: 250, seed: 131, color: "#7d93b3", snow: "#ffffff", snowDepth: 0.5 });
  mountains(S, { base: 340, amp: 170, seed: 137, color: "#5b7a90", snow: "#f4f9fc", snowDepth: 0.28 });
  haze(S, 230, 100, "#e8f3fb", 0.5);
  mountains(S, { base: 380, amp: 100, seed: 141, color: "#2c6a48", sharp: false });
  pines(S, { x0: 0, x1: DW, y: 400, h: 90, color: "#164a30", seed: 15, n: 44, spread: 30 });
  pines(S, { x0: 0, x1: DW, y: 450, h: 120, color: "#0e3524", seed: 16, n: 26, spread: 30 });
  write("dest-manali.svg", S.toString());
}

// Rishikesh -- river, hills and a suspension bridge
{
  const S = new Scene(DW, DH);
  sky(S, [[0, "#9ec1e6"], [0.55, "#f4d6c4"], [1, "#fbe8cf"]]);
  glow(S, 240, 180, 240, "#ffe6b8", 0.8);
  mountains(S, { base: 250, amp: 130, seed: 151, color: "#6f9ba0", sharp: false });
  mountains(S, { base: 300, amp: 130, seed: 155, color: "#3f8a58", sharp: false });
  mountains(S, { base: 340, amp: 90, seed: 159, color: "#2c7048", sharp: false });
  const rv = nid("rv");
  S.def(vGrad(rv, [[0, "#7fc0c8"], [1, "#2e8a9a"]]));
  S.add(`<rect y="345" width="${DW}" height="95" fill="url(#${rv})"/>`);
  let rip = "";
  for (let i = 0; i < 8; i++) rip += `<path d="M${(i * 83) % 440} ${370 + (i % 3) * 24} q20 -5 40 0" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>`;
  S.add(rip);
  // bridge
  S.add(`<rect x="110" y="170" width="14" height="190" fill="#8c7a63"/><rect x="356" y="170" width="14" height="190" fill="#8c7a63"/><rect x="104" y="166" width="26" height="10" fill="#a68f73"/><rect x="350" y="166" width="26" height="10" fill="#a68f73"/>`);
  S.add(`<path d="M20 300 Q117 282 117 290 M117 176 Q240 336 363 176" fill="none" stroke="#4d4a45" stroke-width="4"/><path d="M363 290 Q400 282 470 300" fill="none" stroke="#4d4a45" stroke-width="4"/><path d="M117 330 L363 330" stroke="#4d4a45" stroke-width="7"/><path d="M117 322 L363 322" stroke="#2f2c28" stroke-width="3"/>`);
  let hang = "";
  for (let i = 0; i <= 12; i++) {
    const t = i / 12, x = 117 + t * 246;
    const cable = 176 + (1 - (2 * t - 1) ** 2) * 80; // parabola dip
    hang += `<line x1="${f(x)}" y1="${f(cable)}" x2="${f(x)}" y2="322" stroke="#4d4a45" stroke-width="1.6"/>`;
  }
  S.add(hang);
  // temple
  S.add(`<rect x="380" y="290" width="70" height="60" fill="#f7efe4"/><path d="M372 292 L415 244 L458 292Z" fill="#e2762b"/><path d="M406 244 L415 214 L424 244Z" fill="#c9581a"/><rect x="408" y="316" width="14" height="34" rx="7" fill="#7b4a2a"/>`);
  S.add(`<path d="M20 300 L20 350 M60 296 L60 352" stroke="#8c7a63" stroke-width="5"/>`);
  write("dest-rishikesh.svg", S.toString());
}

// Jaipur -- Hawa Mahal style facade
{
  const S = new Scene(DW, DH);
  sky(S, [[0, "#4a9fe0"], [1, "#bfe1f6"]]);
  glow(S, 90, 80, 160, "#fff", 0.7);
  S.add(`<rect y="360" width="${DW}" height="80" fill="#5a5450"/><rect y="352" width="${DW}" height="12" fill="#c9a37a"/>`);
  const tiers = [
    { y: 300, h: 56, x: 40, w: 400, n: 9 },
    { y: 244, h: 56, x: 70, w: 340, n: 8 },
    { y: 188, h: 56, x: 100, w: 280, n: 6 },
    { y: 132, h: 56, x: 140, w: 200, n: 5 },
    { y: 84, h: 48, x: 186, w: 108, n: 3 },
  ];
  for (const t of tiers) {
    S.add(`<rect x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" fill="#e0785c"/><rect x="${t.x - 6}" y="${t.y - 6}" width="${t.w + 12}" height="9" fill="#f2c9a8"/>`);
    const gap = t.w / t.n;
    let wn = "";
    for (let i = 0; i < t.n; i++) {
      const cx = t.x + gap * (i + 0.5);
      wn += `<path d="M${f(cx - 9)} ${t.y + t.h - 4} L${f(cx - 9)} ${t.y + 24} A9 9 0 0 1 ${f(cx + 9)} ${t.y + 24} L${f(cx + 9)} ${t.y + t.h - 4}Z" fill="#7d2f22"/><path d="M${f(cx - 5)} ${t.y + t.h - 6} L${f(cx - 5)} ${t.y + 26} A5 5 0 0 1 ${f(cx + 5)} ${t.y + 26} L${f(cx + 5)} ${t.y + t.h - 6}Z" fill="#f2c9a8" opacity=".55"/>`;
      wn += `<path d="M${f(cx - 12)} ${t.y - 6} q12 -14 24 0Z" fill="#f2c9a8"/>`;
    }
    S.add(wn);
  }
  S.add(`<path d="M196 84 q44 -50 88 0Z" fill="#c7563a"/><rect x="238" y="20" width="4" height="22" fill="#5a2a1e"/><path d="M186 84 h108" stroke="#f2c9a8" stroke-width="6"/>`);
  S.add(`<path d="M0 360 L480 360 L480 440 L0 440Z" fill="#4c4743"/><path d="M0 400 L480 400" stroke="#6b645e" stroke-width="3" stroke-dasharray="26 18"/>`);
  write("dest-jaipur.svg", S.toString());
}

/* ------------------------------------------------------------- avatars */
function avatar(name, { skin, hair, shirt, bg, beard = false, long = false }) {
  const S = new Scene(160, 160);
  S.add(`<rect width="160" height="160" fill="${bg}"/>`);
  if (long) S.add(`<path d="M42 78 C38 30 122 30 118 78 L124 132 L36 132Z" fill="${hair}"/>`);
  S.add(`<path d="M20 160 C24 122 54 112 80 112 C106 112 136 122 140 160Z" fill="${shirt}"/><rect x="68" y="92" width="24" height="26" rx="8" fill="${skin}"/>`);
  S.add(`<ellipse cx="80" cy="70" rx="30" ry="34" fill="${skin}"/>`);
  if (beard) S.add(`<path d="M52 74 C54 108 106 108 108 74 C102 90 58 90 52 74Z" fill="${hair}" opacity=".9"/>`);
  S.add(long ? `<path d="M50 62 C52 32 108 30 110 62 C98 50 66 46 50 62Z" fill="${hair}"/>` : `<path d="M48 66 C46 30 112 26 112 66 C104 48 62 44 48 66Z" fill="${hair}"/>`);
  S.add(`<circle cx="68" cy="72" r="3" fill="#2a1a12"/><circle cx="92" cy="72" r="3" fill="#2a1a12"/><path d="M70 88 q10 8 20 0" fill="none" stroke="#7a3b2a" stroke-width="3" stroke-linecap="round"/>`);
  write(`avatar-${name}.svg`, S.toString());
}
avatar("amit", { skin: "#c58a62", hair: "#1c1410", shirt: "#2f4a7a", bg: "#f3d7c7", beard: true });
avatar("priya", { skin: "#d69a72", hair: "#1a1210", shirt: "#c1121f", bg: "#fbe3e6", long: true });
avatar("rohan", { skin: "#b97a54", hair: "#15100d", shirt: "#2d6a4f", bg: "#dcefe5" });
avatar("sneha", { skin: "#e0a67e", hair: "#3a2416", shirt: "#7a4aa8", bg: "#ece2f6", long: true });

console.log("art generated in", OUT);
