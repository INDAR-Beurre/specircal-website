import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const websitesDir = './public/projects';
const outputDir = './public/assets/previews';

// Ensure output folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Find Chrome on macOS
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!fs.existsSync(chromePath)) {
  console.error(`Error: Google Chrome not found at ${chromePath}. Please verify installation path.`);
  process.exit(1);
}

if (!fs.existsSync(websitesDir)) {
  console.error(`Error: Projects directory ${websitesDir} does not exist.`);
  process.exit(1);
}

const files = fs.readdirSync(websitesDir).filter(f => f.endsWith('.html'));
console.log(`Found ${files.length} HTML files to capture.`);

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const outputPath = path.join(outputDir, `${file}.png`);

    // Skip if preview screenshot already exists
    if (fs.existsSync(outputPath)) {
      continue;
    }

    const absolutePath = path.resolve(websitesDir, file);
    const localUrl = `file://${absolutePath}`;
    console.log(`[${i + 1}/${files.length}] Capturing ${file}...`);

    try {
      await page.goto(localUrl, { waitUntil: 'load', timeout: 5000 });
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 800)));
      await page.screenshot({ path: outputPath, type: 'png' });
    } catch (err) {
      console.error(`Failed to capture ${file}:`, err.message);
    }
  }

  await browser.close();
  console.log('Capture complete! Previews synced.');
}

captureScreenshots().catch(err => {
  console.error('Critical Error running screenshot script:', err);
});
