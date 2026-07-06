import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'figma', 'GHITHAA-FIGMA-PASTE.html');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.cjs': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

function serveStatic(root) {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://localhost');
      let filePath = path.join(root, decodeURIComponent(url.pathname));
      if (url.pathname === '/' || url.pathname.endsWith('/')) {
        filePath = path.join(filePath, 'index.html');
      }
      if (!filePath.startsWith(root)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      const data = await readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });
}

console.log('Starting local server + headless browser...');

const server = serveStatic(ROOT);
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const pageUrl = `http://127.0.0.1:${port}/figma/ghithaa-complete.html`;

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1800, height: 1200 });
  await page.goto(pageUrl, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);

  console.log('Converting 14 screens to Figma clipboard payload...');

  const payload = await page.evaluate(async () => {
    const { generateFromElements, inlineComputedStyles } = await import(
      'https://esm.sh/@magicpatterns/html-to-figma@1.0.5?bundle'
    );

    const wraps = Array.from(document.querySelectorAll('.screen-wrap'));
    const COLS = 4;
    const GAP_X = 32;
    const GAP_Y = 48;
    const W = 390;
    const H = 844;

    const screens = wraps.map((wrap, i) => {
      const phone = wrap.querySelector('.phone');
      const label = wrap.querySelector('.screen-label')?.textContent?.trim() || `Screen ${i + 1}`;
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = col * (W + GAP_X);
      const y = row * (H + GAP_Y + 24);
      const inlined = inlineComputedStyles(phone);
      const root = new DOMParser().parseFromString(inlined, 'text/html').body.firstElementChild;
      return { root, x, y, name: label };
    });

    return generateFromElements(screens, { name: 'Ghithaa Mobile v1' });
  });

  if (!payload || typeof payload !== 'string') {
    throw new Error('Export returned empty payload');
  }

  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Ghithaa — Paste into Figma</title>
  <style>
    body { font-family: "IBM Plex Sans", system-ui, sans-serif; max-width: 520px; margin: 48px auto; padding: 0 24px; color: #1A2E2B; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    p { color: #5C6F6B; line-height: 1.6; }
    ol { line-height: 1.8; }
    button { background: #0F6E68; color: #fff; border: none; padding: 16px 28px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 20px; width: 100%; }
    button:hover { background: #0A554F; }
    .ok { color: #0F8F6A; font-weight: 600; margin-top: 16px; }
    .box { background: #F1F8F7; border: 1px solid #E8EDEB; border-radius: 12px; padding: 16px; margin-top: 24px; font-size: 13px; }
  </style>
</head>
<body>
  <h1>Ghithaa Mobile → Figma</h1>
  <p>All <strong>14 screens</strong> are ready. One click copies them for Figma.</p>
  <ol>
    <li>Click the button below</li>
    <li>Open <a href="https://www.figma.com" target="_blank">figma.com</a> → New design file</li>
    <li>Click the canvas → press <strong>Ctrl+V</strong></li>
  </ol>
  <button type="button" id="copy">Copy all 14 screens for Figma</button>
  <p id="status"></p>
  <div class="box">
    <strong>Includes:</strong> Splash, Onboarding, City, Login, Home, Menu, Plans, Subscribe, Orders, Wallet, Profile, Meal Detail, Subscribe Meals
  </div>
  <script id="figma-payload" type="application/json">${JSON.stringify(payload)}</script>
  <script>
    document.getElementById('copy').onclick = async () => {
      const p = JSON.parse(document.getElementById('figma-payload').textContent);
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'text/html': new Blob([p], { type: 'text/html' }) })
        ]);
        document.getElementById('status').className = 'ok';
        document.getElementById('status').textContent = 'Copied! Open Figma and press Ctrl+V on the canvas.';
      } catch (err) {
        document.getElementById('status').textContent = 'Clipboard blocked — try opening this file in Chrome (double-click from Explorer).';
      }
    };
  </script>
</body>
</html>`;

  await writeFile(OUT, htmlDoc, 'utf8');
  await writeFile(path.join(ROOT, 'figma', 'ghithaa-figma-clipboard.html'), payload, 'utf8');

  console.log('');
  console.log('SUCCESS');
  console.log(`  Screens: ${await page.evaluate(() => document.querySelectorAll('.screen-wrap').length)}`);
  console.log(`  Open: figma/GHITHAA-FIGMA-PASTE.html`);
  console.log('  Click button → Paste in Figma (Ctrl+V)');
  console.log('');
} finally {
  await browser.close();
  server.close();
}
