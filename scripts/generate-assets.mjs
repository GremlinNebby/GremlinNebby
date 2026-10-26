// Generates the forest SVGs for the profile README.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const out = process.argv[2] ?? fileURLToPath(new URL("../assets", import.meta.url));
mkdirSync(out, { recursive: true });

let seed = 42;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const r = (a, b) => a + rand() * (b - a);

const PINE = `<symbol id="pine" viewBox="0 0 40 100"><path d="M20 0L28 22H24L32 42H27L36 64H30L40 86H22V100H18V86H0L10 64H4L13 42H8L16 22H12Z"/></symbol>`;

function forest({ width, base, minH, maxH, step, color, ground = 0, sway = false }) {
  let s = `<g fill="${color}"${sway ? ' class="sway"' : ""}>`;
  for (let x = -30; x < width + 30; x += step * r(0.6, 1.3)) {
    const h = r(minH, maxH);
    const k = h / 100;
    s += `<use href="#pine" width="40" height="100" transform="translate(${(x - 20 * k).toFixed(1)} ${(base - h).toFixed(1)}) scale(${k.toFixed(3)})"/>`;
  }
  if (ground) s += `<rect x="0" y="${base - 2}" width="${width}" height="${ground}"/>`;
  return s + "</g>";
}

function fireflies(n, w, y0, y1) {
  let s = '<g class="ff">';
  for (let i = 0; i < n; i++) {
    s += `<circle cx="${r(20, w - 20).toFixed(0)}" cy="${r(y0, y1).toFixed(0)}" r="${r(1.4, 2.6).toFixed(1)}" style="animation-delay:${r(0, 6).toFixed(2)}s;animation-duration:${r(3, 7).toFixed(2)}s"/>`;
  }
  return s + "</g>";
}

const STYLE = `
.ff circle{fill:#D9F59A;filter:url(#glow);opacity:0;animation:blink 5s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:0;transform:translateY(0)}50%{opacity:.95;transform:translateY(-6px)}}
.mist{animation:drift 28s ease-in-out infinite alternate}
.mist2{animation:drift 36s ease-in-out infinite alternate-reverse}
@keyframes drift{from{transform:translateX(-60px)}to{transform:translateX(60px)}}
.star{fill:#E8F0D8;animation:twinkle 4s ease-in-out infinite}
@keyframes twinkle{0%,100%{opacity:.2}50%{opacity:.9}}
.fade{opacity:0;animation:fade 1.6s ease-out forwards}
.fade2{animation-delay:.5s}
@keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;opacity:1!important}}
`;

const GLOW = `<filter id="glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

// ---------- Banner ----------
{
  const W = 1200, H = 340;
  let stars = "";
  for (let i = 0; i < 45; i++)
    stars += `<circle class="star" cx="${r(0, W).toFixed(0)}" cy="${r(8, 150).toFixed(0)}" r="${r(0.5, 1.4).toFixed(1)}" style="animation-delay:${r(0, 4).toFixed(2)}s"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Hi, I'm Silas — a misty pine forest under the moon">
<defs>
${PINE}
${GLOW}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06120B"/><stop offset=".55" stop-color="#0F2A1A"/><stop offset="1" stop-color="#2B5C38"/></linearGradient>
<radialGradient id="moonGlow"><stop offset="0" stop-color="#E8F0D8" stop-opacity=".35"/><stop offset="1" stop-color="#E8F0D8" stop-opacity="0"/></radialGradient>
<linearGradient id="mistG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8D8A8" stop-opacity="0"/><stop offset=".5" stop-color="#B8D8A8" stop-opacity=".16"/><stop offset="1" stop-color="#B8D8A8" stop-opacity="0"/></linearGradient>
<linearGradient id="title" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#C9E4A8"/><stop offset="1" stop-color="#7FB069"/></linearGradient>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="18"/></clipPath>
</defs>
<style>${STYLE}</style>
<g clip-path="url(#frame)">
<rect width="${W}" height="${H}" fill="url(#sky)"/>
${stars}
<circle cx="1010" cy="78" r="90" fill="url(#moonGlow)"/>
<circle cx="1010" cy="78" r="30" fill="#E8F0D8"/>
<circle cx="1022" cy="70" r="28" fill="#0F2A1A" opacity=".18"/>
<path d="M0 250 L120 205 L230 232 L360 182 L470 225 L610 190 L740 228 L870 176 L1000 220 L1110 196 L1200 222 V${H} H0Z" fill="#1B4229" opacity=".75"/>
${forest({ width: W, base: 262, minH: 40, maxH: 70, step: 16, color: "#1E4A2D", ground: 90 })}
<rect class="mist" x="-100" y="225" width="${W + 200}" height="60" fill="url(#mistG)"/>
${forest({ width: W, base: 296, minH: 60, maxH: 105, step: 24, color: "#14341F", ground: 60 })}
<rect class="mist2" x="-100" y="270" width="${W + 200}" height="50" fill="url(#mistG)"/>
${forest({ width: W, base: 346, minH: 90, maxH: 170, step: 46, color: "#0A1D11" })}
${fireflies(26, W, 170, 320)}
<g font-family="Georgia, 'Palatino Linotype', 'Times New Roman', serif" text-anchor="middle">
<text class="fade" x="${W / 2}" y="112" font-size="60" font-weight="700" fill="url(#title)" letter-spacing="1">Hi, I'm Silas</text>
<text class="fade fade2" x="${W / 2}" y="152" font-size="20" fill="#A9C99A" font-style="italic" letter-spacing="3">rooted in code · growing every day</text>
</g>
</g>
</svg>`;
  writeFileSync(join(out, "banner.svg"), svg);
}

// ---------- Divider ----------
{
  const W = 1200, H = 40;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>${PINE}<linearGradient id="ln" x1="0" x2="1"><stop offset="0" stop-color="#2D6A3E" stop-opacity="0"/><stop offset=".5" stop-color="#52A36B"/><stop offset="1" stop-color="#2D6A3E" stop-opacity="0"/></linearGradient></defs>
<rect x="0" y="27" width="${W}" height="2" fill="url(#ln)"/>
<g fill="#52A36B">
<use href="#pine" x="${W / 2 - 34}" y="12" width="12" height="30"/>
<use href="#pine" x="${W / 2 - 11}" y="2" width="16" height="40"/>
<use href="#pine" x="${W / 2 + 18}" y="12" width="12" height="30"/>
</g>
</svg>`;
  writeFileSync(join(out, "divider.svg"), svg);
}

// ---------- Footer ----------
{
  const W = 1200, H = 150;
  seed = 7;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Forest treeline">
<defs>
${PINE}
${GLOW}
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06120B"/><stop offset="1" stop-color="#2B5C38"/></linearGradient>
<clipPath id="frame"><rect width="${W}" height="${H}" rx="18"/></clipPath>
</defs>
<style>${STYLE}</style>
<g clip-path="url(#frame)">
<rect width="${W}" height="${H}" fill="url(#fade)"/>
${forest({ width: W, base: 120, minH: 30, maxH: 60, step: 14, color: "#1E4A2D", ground: 40 })}
${forest({ width: W, base: 155, minH: 50, maxH: 95, step: 30, color: "#0A1D11" })}
${fireflies(14, W, 40, 130)}
<text x="${W / 2}" y="40" text-anchor="middle" font-family="Georgia, 'Palatino Linotype', 'Times New Roman', serif" font-size="17" font-style="italic" letter-spacing="3" fill="#A9C99A">thanks for wandering through</text>
</g>
</svg>`;
  writeFileSync(join(out, "footer.svg"), svg);
}
console.log("ok");
