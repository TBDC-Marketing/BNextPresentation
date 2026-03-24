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

// Slides that use dark mode (1-indexed): 1, 3-16, 21
const DARK_SLIDE_IDS = [
  'opening',
  'story-enabled-talent', 'story-aishar', 'story-dacasto', 'story-bookmytherapy',
  'story-questify', 'story-silknext', 'story-simpleview', 'story-synoris',
  'story-smartaura', 'story-officeflow', 'story-nativchefs', 'story-treepz',
  'story-milesmate', 'story-oxana',
  'closing'
];

const OUTPUT_PATH = '/mnt/user-data/outputs/BNext_Impact_Presentation_Print.pdf';
const PORT = 3458;
const URL = `http://127.0.0.1:${PORT}`;
const DIST_DIR = '/home/user/BNextPresentation/dist';

const MIME_TYPES = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ttf': 'font/ttf',
};

const BASE_PATH = '/BNextPresentation/';

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      // Strip the base path prefix so assets resolve correctly
      let urlPath = req.url;
      if (urlPath.startsWith(BASE_PATH)) {
        urlPath = '/' + urlPath.slice(BASE_PATH.length);
      }
      let filePath = join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);
      try {
        const data = readFileSync(filePath);
        const ext = extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      } catch {
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

/**
 * CSS overrides for print-friendly PDF:
 * 1. Invert dark mode slides to light backgrounds for printing
 * 2. Shrink title fonts on slides 17 (mentor-network) and 19 (ecosystem-role)
 * 3. Spread out content on slide 20 (community-support)
 */
function getPrintCSS() {
  // Build selectors for all dark slide sections
  const darkSelectors = DARK_SLIDE_IDS.map(id => `#${id}`);
  const darkPanelSelectors = DARK_SLIDE_IDS.map(id => `#${id} .stage-panel--dark`);

  return `
    /* ========================================
       0. GLOBAL: Light outer background for all slides
       ======================================== */

    html, body {
      background: #f5f3f0 !important;
    }

    body {
      background: #f5f3f0 !important;
    }

    /* All section wrappers: light background */
    ${darkSelectors.join(',\n    ')} {
      background: #f5f3f0 !important;
    }

    /* ========================================
       1. DARK MODE INVERSION FOR PRINTING
       ======================================== */

    /* Override the dark panel background to light */
    ${darkPanelSelectors.join(',\n    ')} {
      background:
        radial-gradient(circle at 88% 18%, rgba(255, 202, 5, 0.16), transparent 22%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 243, 240, 0.98)) !important;
      border-color: rgba(18, 22, 28, 0.08) !important;
      box-shadow: 0 24px 80px rgba(18, 22, 28, 0.14) !important;
      color: var(--navy) !important;
    }

    /* Logos: invert to be visible on light bg */
    ${darkSelectors.map(s => `${s} img[alt*="Brampton"], ${s} img[alt*="BHive"]`).join(',\n    ')} {
      filter: brightness(0) saturate(100%) !important;
    }

    /* Override ALL white text classes to navy on dark slides */
    ${darkSelectors.map(s => `${s} .text-white`).join(',\n    ')} {
      color: var(--navy) !important;
    }

    ${darkSelectors.map(s => `${s} [class*="text-white\\/"]`).join(',\n    ')} {
      color: rgba(18, 22, 28, 0.7) !important;
    }

    /* More specific overrides for common opacity variants */
    ${darkSelectors.map(s => `${s} .text-white\\/90`).join(',\n    ')} {
      color: rgba(18, 22, 28, 0.9) !important;
    }

    ${darkSelectors.map(s => `${s} .text-white\\/80`).join(',\n    ')} {
      color: rgba(18, 22, 28, 0.8) !important;
    }

    ${darkSelectors.map(s => `${s} .text-white\\/75`).join(',\n    ')},
    ${darkSelectors.map(s => `${s} .text-white\\/78`).join(',\n    ')},
    ${darkSelectors.map(s => `${s} .text-white\\/72`).join(',\n    ')},
    ${darkSelectors.map(s => `${s} .text-white\\/70`).join(',\n    ')} {
      color: rgba(18, 22, 28, 0.75) !important;
    }

    ${darkSelectors.map(s => `${s} .text-white\\/65`).join(',\n    ')},
    ${darkSelectors.map(s => `${s} .text-white\\/55`).join(',\n    ')},
    ${darkSelectors.map(s => `${s} .text-white\\/50`).join(',\n    ')} {
      color: rgba(18, 22, 28, 0.55) !important;
    }

    ${darkSelectors.map(s => `${s} .text-white\\/40`).join(',\n    ')},
    ${darkSelectors.map(s => `${s} .text-white\\/35`).join(',\n    ')} {
      color: rgba(18, 22, 28, 0.45) !important;
    }

    ${darkSelectors.map(s => `${s} .text-white\\/25`).join(',\n    ')} {
      color: rgba(18, 22, 28, 0.3) !important;
    }

    /* Company description: was text-white/35, needs to be visible */
    ${darkSelectors.map(s => `${s} p[class*="tracking-"][class*="uppercase"][class*="text-white"]`).join(',\n    ')} {
      color: rgba(18, 22, 28, 0.5) !important;
    }

    /* Yellow text → deep orange for print readability on white bg */
    ${darkSelectors.map(s => `${s} .text-\\[var\\(--yellow\\)\\]`).join(',\n    ')} {
      color: var(--deep-orange) !important;
    }

    ${darkSelectors.map(s => `${s} .text-\\[var\\(--yellow\\)\\]\\/60`).join(',\n    ')} {
      color: var(--orange) !important;
    }

    /* Borders: white → navy */
    ${darkSelectors.map(s => `${s} .border-white\\/10`).join(',\n    ')},
    ${darkSelectors.map(s => `${s} .border-white\\/8`).join(',\n    ')} {
      border-color: rgba(18, 22, 28, 0.1) !important;
    }

    ${darkSelectors.map(s => `${s} .border-\\[var\\(--yellow\\)\\]\\/25`).join(',\n    ')} {
      border-color: rgba(244, 132, 36, 0.25) !important;
    }

    ${darkSelectors.map(s => `${s} .border-\\[var\\(--yellow\\)\\]\\/15`).join(',\n    ')} {
      border-color: rgba(244, 132, 36, 0.15) !important;
    }

    /* Backgrounds: white-alpha → navy-alpha for light mode */
    ${darkSelectors.map(s => `${s} .bg-white\\/5`).join(',\n    ')},
    ${darkSelectors.map(s => `${s} .bg-white\\/\\[0\\.05\\]`).join(',\n    ')},
    ${darkSelectors.map(s => `${s} .bg-white\\/\\[0\\.04\\]`).join(',\n    ')} {
      background-color: rgba(18, 22, 28, 0.04) !important;
    }

    /* Then card: light gray bg */
    ${darkSelectors.map(s => `${s} .bg-white\\/\\[0\\.03\\]`).join(',\n    ')} {
      background: rgba(245, 243, 240, 0.85) !important;
    }

    /* Section rule line */
    ${darkSelectors.map(s => `${s} .bg-white\\/15`).join(',\n    ')} {
      background-color: rgba(18, 22, 28, 0.12) !important;
    }

    /* Closing slide: story-surface card */
    #closing .story-surface {
      background: rgba(244, 132, 36, 0.08) !important;
      border-color: rgba(18, 22, 28, 0.1) !important;
    }

    #closing .story-surface .text-\\[var\\(--yellow\\)\\] {
      color: var(--deep-orange) !important;
    }

    /* QuoteBlock on ANY slide: keep dark bg for contrast (intentionally dark) */
    #community-support blockquote,
    ${darkSelectors.map(s => `${s} blockquote`).join(',\n    ')} {
      background: var(--navy) !important;
      color: white !important;
    }
    #community-support blockquote *,
    ${darkSelectors.map(s => `${s} blockquote *`).join(',\n    ')} {
      color: inherit !important;
    }
    #community-support blockquote .text-\\[var\\(--yellow\\)\\],
    ${darkSelectors.map(s => `${s} blockquote .text-\\[var\\(--yellow\\)\\]`).join(',\n    ')} {
      color: var(--yellow) !important;
    }
    #community-support blockquote footer p:first-child,
    ${darkSelectors.map(s => `${s} blockquote footer p:first-child`).join(',\n    ')} {
      color: white !important;
    }
    #community-support blockquote footer p:last-child,
    ${darkSelectors.map(s => `${s} blockquote footer p:last-child`).join(',\n    ')} {
      color: rgba(255, 255, 255, 0.65) !important;
    }
    #community-support blockquote footer,
    ${darkSelectors.map(s => `${s} blockquote footer`).join(',\n    ')} {
      border-color: rgba(255, 255, 255, 0.1) !important;
    }

    /* ========================================
       2. SLIDE 17 (mentor-network) & 19 (ecosystem-role):
          Shrink title font to prevent overlap with cards
       ======================================== */

    /* Use very specific selector to override Tailwind's inline clamp */
    section#mentor-network h2.font-display {
      font-size: 2.8rem !important;
      max-width: 100% !important;
    }

    section#ecosystem-role h2.font-display {
      font-size: 2.8rem !important;
      max-width: 100% !important;
    }

    /* Also reduce the left column width slightly to give more room */
    section#mentor-network .md\\:col-span-4 {
      grid-column: span 4 / span 4 !important;
    }

    section#ecosystem-role .md\\:col-span-5 {
      grid-column: span 4 / span 4 !important;
    }

    section#ecosystem-role .md\\:col-span-7 {
      grid-column: span 8 / span 8 !important;
    }

    /* ========================================
       3. SLIDE 20 (community-support):
          Spread content across the full page height
       ======================================== */

    /* Override flex-1 on blockquote containers so they don't stretch */
    section#community-support blockquote {
      flex: 0 0 auto !important;
    }
  `;
}

async function main() {
  console.log('Starting local server for print PDF...');
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

    const pageUrl = `${URL}${BASE_PATH}`;
    console.log(`Navigating to ${pageUrl}...`);
    await page.goto(pageUrl, { waitUntil: 'load', timeout: 60000 });

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

    // Inject print-specific CSS overrides
    console.log('Injecting print CSS overrides...');
    await page.addStyleTag({ content: getPrintCSS() });

    // Wait for CSS to settle
    await page.waitForTimeout(500);

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

      // Per-slide DOM fixes via JavaScript
      if (id === 'mentor-network') {
        await page.evaluate(() => {
          const section = document.getElementById('mentor-network');
          if (!section) return;

          // Allow overflow so cards/chips aren't clipped by panel border-radius
          const panel = section.querySelector('.stage-panel');
          if (panel) {
            panel.style.overflow = 'visible';
          }

          // Hide "Mentor" chips to save horizontal space
          section.querySelectorAll('article span').forEach(el => {
            if (el.textContent.trim() === 'Mentor') {
              el.style.display = 'none';
            }
          });

          // Reduce gap between cards
          const cardGrid = section.querySelector('[class*="md:col-span-8"] .grid');
          if (cardGrid) {
            cardGrid.style.gap = '0.5rem';
          }
        });
        await page.waitForTimeout(200);
      }

      if (id === 'community-support') {
        await page.evaluate(() => {
          const section = document.getElementById('community-support');
          if (!section) return;

          // Increase card grid spacing and padding
          const cardGrids = section.querySelectorAll('.grid.grid-cols-2');
          cardGrids.forEach(grid => {
            grid.style.gap = '1rem';
          });

          // Enlarge support cards
          section.querySelectorAll('.grid.grid-cols-2 > article').forEach(card => {
            card.style.padding = '1.25rem';
          });
          section.querySelectorAll('.grid.grid-cols-2 > article h3').forEach(h3 => {
            h3.style.fontSize = '1.2rem';
            h3.style.marginTop = '0.5rem';
          });
          section.querySelectorAll('.grid.grid-cols-2 > article p:last-child').forEach(p => {
            p.style.fontSize = '0.88rem';
            p.style.lineHeight = '1.55';
            p.style.marginTop = '0.5rem';
          });

          // Cap blockquote heights and add top margin to push them down
          section.querySelectorAll('blockquote').forEach(q => {
            q.style.maxHeight = 'none';
            q.style.height = 'auto';
            q.style.flex = '0 0 auto';
            // Add large top margin to push down and spread content
            const wrapper = q.parentElement;
            if (wrapper) {
              wrapper.style.flex = '0 0 auto';
              wrapper.style.marginTop = '3rem';
            }
          });

          // Add more vertical space between the heading area and the rest
          const headingH2 = section.querySelector('h2');
          if (headingH2) {
            headingH2.style.marginBottom = '0.5rem';
          }

          // Make description text bigger
          const descP = section.querySelector('h2 + p');
          if (descP) {
            descP.style.fontSize = '1.05rem';
            descP.style.lineHeight = '1.6';
          }
        });
        await page.waitForTimeout(200);
      }

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
    console.log(`Print PDF saved to ${OUTPUT_PATH} (${screenshots.length} pages, ${(pdfBytes.length / 1024 / 1024).toFixed(1)} MB)`);

  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
