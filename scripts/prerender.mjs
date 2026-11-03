/**
 * Post-build step: turns the client bundle's empty shell into a complete HTML
 * document, and emits the crawler files that need an absolute domain.
 *
 * Runs after both `vite build` and `vite build --ssr`. Everything it writes is
 * derived from src/business.ts, so the page, the structured data, the sitemap
 * and llms.txt cannot drift apart.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const server = await import(pathToFileURL(ssrEntry).href);
const {
  render,
  SITE_URL,
  DOMAIN_LIVE,
  BUSINESS_NAME,
  META_DESCRIPTION,
  ADDRESS,
  HOURS,
  KEY_PRICES,
  SHARPENING_PRICE,
  FAQ,
} = server;

const origin = SITE_URL.replace(/\/$/, '');
const canonical = `${origin}/`;
const { html, jsonLd } = render();

// ---------------------------------------------------------------------------
// index.html

let doc = await readFile(path.join(dist, 'index.html'), 'utf8');

// Relative social-card URLs are dropped by several scrapers; make them absolute.
doc = doc.replaceAll('content="/og-image.png"', `content="${origin}/og-image.png"`);

// Canonical and og:url are only truthful once the domain resolves. Pointing a
// canonical at a dead domain while the site sits on a temporary *.vercel.app URL
// gets the page dropped from the index, so until DOMAIN_LIVE the page is marked
// noindex and ships no canonical at all.
const headTags = DOMAIN_LIVE
  ? `  <link rel="canonical" href="${canonical}" />\n` +
    `    <meta property="og:url" content="${canonical}" />\n`
  : '';

if (!DOMAIN_LIVE) {
  doc = doc.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/,
    '<meta name="robots" content="noindex, nofollow" />',
  );
}

doc = doc.replace(
  '</head>',
  headTags +
    `    <script type="application/ld+json">${escapeForScript(jsonLd)}</script>\n` +
    '  </head>',
);

// The payload every JS-less crawler actually reads.
doc = doc.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

await writeFile(path.join(dist, 'index.html'), doc, 'utf8');

// ---------------------------------------------------------------------------
// robots.txt — AI crawlers are named explicitly so there is no ambiguity about
// whether they may read the site.

const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
];

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  ...AI_AGENTS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
  `Sitemap: ${origin}/sitemap.xml`,
  '',
].join('\n');

await writeFile(path.join(dist, 'robots.txt'), robots, 'utf8');

// ---------------------------------------------------------------------------
// sitemap.xml — one real URL. Fragment anchors are deliberately absent: Google
// ignores them in sitemaps.

await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${canonical}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
  'utf8',
);

// ---------------------------------------------------------------------------
// llms.txt — a plain-text brief for answer engines. Not a ratified standard,
// but it costs nothing and some tools do fetch it.

const llms = `# ${BUSINESS_NAME}

> ${META_DESCRIPTION}

- Adresă: ${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.region}, România
- Site: [Chei Cluj](${canonical})
- Limbă: română

## Servicii și informații

- [Copiere chei și cartele de acces](${canonical}#chei): servicii și prețuri.
- [Ascuțire cuțite](${canonical}#ascutire): tipuri de lame și tarife.
- [Program și adresă](${canonical}#locatie): unde ne găsești în Cluj-Napoca.
- [Întrebări frecvente](${canonical}#intrebari): răspunsuri despre serviciile atelierului.

## Program

${HOURS.map((h) => `- ${h.days}: ${h.hours}`).join('\n')}

## Copiere chei — prețuri

${KEY_PRICES.map((p) => `- ${p.label}${p.note ? ` (${p.note})` : ''}: ${p.price}`).join('\n')}

Prețul final depinde de profilul cheii și se confirmă înainte de începerea lucrării.

## Ascuțire cuțite

- Cuțite de bucătărie din oțel, satâre și cuțite de măcelărie: ${SHARPENING_PRICE.price} per lamă.
- Nu ascuțim foarfece și nu lucrăm lame ceramice.

## Întrebări frecvente

${FAQ.map((f) => `### ${f.question}\n\n${f.answer}`).join('\n\n')}
`;

await writeFile(path.join(dist, 'llms.txt'), llms, 'utf8');

// ---------------------------------------------------------------------------

/** JSON is safe inside <script> except for a literal `</script>` sequence. */
function escapeForScript(json) {
  return json.replaceAll('<', '\\u003c');
}

console.log(
  `prerender: ${(html.length / 1024).toFixed(0)} KB of markup + ${(jsonLd.length / 1024).toFixed(1)} KB JSON-LD -> dist/index.html`,
);
console.log(`prerender: robots.txt, sitemap.xml, llms.txt written for ${origin}`);

if (!DOMAIN_LIVE) {
  console.warn(
    `prerender: DOMAIN_LIVE is false — page marked noindex, no canonical emitted.\n` +
      `           Set DOMAIN_LIVE = true in src/business.ts once ${origin} resolves.`,
  );
}
