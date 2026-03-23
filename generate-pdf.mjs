import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import http from 'http';
import { readFileSync } from 'fs';
import { join, extname } from 'path';

const SECTION_IDS = [
  'opening', 'evidence-outcomes', 'story-enabled-talent', 'story-aishar',
  'story-dacasto', 'story-bookmytherapy', 'story-questify', 'story-silknext',
  'story-simpleview', 'story-synoris', 'story-smartaura', 'story-officeflow',
  'story-nativchefs', 'story-treepz', 'story-milesmate', 'story-oxana',
  'mentor-network', 'access-gap', 'ecosystem-role', 'community-support', 'closing'
];

const OUTPUT_PATH = '/mnt/user-data/outputs/BNext_Impact_Presentation.pdf';
const PORT = 3457;
const URL = `http://127.0.0.1:${PORT}`;
const DIST_DIR = '/home/user/BNextPresentation/dist';

const MIME_TYPES = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ttf': 'font/ttf',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
      try {
        const data = readFileSync(filePath);
        const ext = extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      } catch {
        // Try index.html for SPA fallback
        try {
          const data = readFileSync(join(DIST_DIR, 'index.html'));
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        } catch {
          res.writeHead(404);
          res.end('Not found');
        }
      }
    });
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`Server listening on ${URL}`);
      resolve(server);
    });
  });
}

async function main() {
  console.log('Starting local server...');
  const server = await startServer();

  let browser;
  try {
    console.log('Launching browser...');
    browser = await chromium.launch({
      executablePath: '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    console.log(`Navigating to ${URL}...`);
    await page.goto(URL, { waitUntil: 'load', timeout: 60000 });

    // Wait for fonts
    await page.evaluate(() => document.fonts.ready);
    // Extra settle time for animations and images
    await page.waitForTimeout(2000);

    // Hide navigation overlay (fixed positioned elements)
    await page.evaluate(() => {
      document.querySelectorAll('.fixed').forEach(el => {
        el.style.display = 'none';
      });
    });

    // Capture each section
    const screenshots = [];
    for (let i = 0; i < SECTION_IDS.length; i++) {
      const id = SECTION_IDS[i];
      console.log(`Capturing section ${i + 1}/${SECTION_IDS.length}: ${id}`);

      // Scroll section into view
      await page.evaluate((sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'instant' });
      }, id);

      // Wait for scroll-triggered animations / intersection observers
      await page.waitForTimeout(600);

      // Re-hide any fixed elements that may have reappeared
      await page.evaluate(() => {
        document.querySelectorAll('.fixed').forEach(el => {
          el.style.display = 'none';
        });
      });

      // Screenshot the section element
      const element = await page.$(`#${id}`);
      if (!element) {
        console.warn(`Section #${id} not found, skipping`);
        continue;
      }

      const screenshot = await element.screenshot({ type: 'png' });
      screenshots.push(screenshot);
    }

    console.log(`Captured ${screenshots.length} sections. Assembling PDF...`);

    // Assemble PDF
    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < screenshots.length; i++) {
      const pngImage = await pdfDoc.embedPng(screenshots[i]);
      // Use the actual image dimensions divided by deviceScaleFactor for page size in points
      const pageWidth = pngImage.width / 2;
      const pageHeight = pngImage.height / 2;
      const pdfPage = pdfDoc.addPage([pageWidth, pageHeight]);
      pdfPage.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(OUTPUT_PATH, pdfBytes);
    console.log(`PDF saved to ${OUTPUT_PATH} (${screenshots.length} pages, ${(pdfBytes.length / 1024 / 1024).toFixed(1)} MB)`);

  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
