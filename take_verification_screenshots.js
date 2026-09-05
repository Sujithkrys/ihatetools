const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 1. Homepage After
  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(__dirname, 'after_homepage.png'), fullPage: true });
  
  // 2. Tools Index
  console.log('Navigating to /tools...');
  await page.goto('http://localhost:3000/tools', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(__dirname, 'tools_index.png'), fullPage: true });

  // 3. Individual Tool Cards (Capture them from the tools index by taking specific locators)
  
  // PDF Tool: Merge PDF (href="/tools/merge-pdf")
  const mergePdfCard = page.locator('a[href="/tools/merge-pdf"]');
  await mergePdfCard.screenshot({ path: path.join(__dirname, 'card_pdf_merge.png') });
  
  // Image Tool: Compress Image (href="/tools/compress-image")
  const compressImageCard = page.locator('a[href="/tools/compress-image"]');
  await compressImageCard.screenshot({ path: path.join(__dirname, 'card_image_compress.png') });
  
  // Text Tool: Word Counter (href="/tools/word-counter")
  const wordCounterCard = page.locator('a[href="/tools/word-counter"]');
  await wordCounterCard.screenshot({ path: path.join(__dirname, 'card_text_word_counter.png') });

  await browser.close();
  console.log('Verification screenshots captured!');
}

main().catch(console.error);
