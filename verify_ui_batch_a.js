const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testPdfInfo(page) {
  console.log("--- Testing PDF Info Viewer ---");
  await page.goto('http://localhost:3000/tools/pdf-info');
  await page.setInputFiles('input[type="file"]', path.join(__dirname, 'test-source.pdf'));
  await page.waitForSelector('text=Verification Test PDF');
  const titleText = await page.locator('text=Verification Test PDF').innerText();
  const pageCountText = await page.locator('text=2 Pages').innerText();
  console.log(`Verified metadata: Title="${titleText}", Pages="${pageCountText}"`);
}

async function testExtractPdfText(page) {
  console.log("--- Testing Extract PDF Text ---");
  await page.goto('http://localhost:3000/tools/extract-pdf-text');
  await page.setInputFiles('input[type="file"]', path.join(__dirname, 'test-source.pdf'));
  await page.waitForSelector('textarea');
  const extractedText = await page.locator('textarea').inputValue();
  console.log(`Extracted Text: "${extractedText.trim()}"`);
  if (!extractedText.includes("This is the exact text we expect to extract.")) {
    throw new Error("Text extraction failed to find expected text.");
  }
}

async function testExtractPdfImages(page) {
  console.log("--- Testing Extract PDF Images ---");
  // 1. PDF with Image
  await page.goto('http://localhost:3000/tools/extract-pdf-images');
  await page.setInputFiles('input[type="file"]', path.join(__dirname, 'test-source.pdf'));
  try {
    await page.waitForSelector('text=Found 1 Image', { timeout: 10000 });
    const imgUrl = await page.getAttribute('img', 'src');
    console.log(`Found 1 image with URL: ${imgUrl ? 'Valid Blob URL' : 'Missing'}`);
  } catch (err) {
    await page.screenshot({ path: path.join(__dirname, 'extract_fail.png') });
    throw err;
  }
  
  // 2. PDF without Image
  await page.goto('http://localhost:3000/tools/extract-pdf-images');
  await page.setInputFiles('input[type="file"]', path.join(__dirname, 'test-empty.pdf'));
  await page.waitForSelector('text=No extractable JPEG images were found');
  console.log("Successfully handled PDF with no images (showed clear warning).");
}

async function testPdfToPng(page) {
  console.log("--- Testing PDF to PNG ---");
  await page.goto('http://localhost:3000/tools/pdf-to-png');
  await page.setInputFiles('input[type="file"]', path.join(__dirname, 'test-source.pdf'));
  await page.waitForSelector('text=Page 1');
  const imgUrls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => img.src);
  });
  console.log(`Rendered ${imgUrls.length} PNGs. First URL: ${imgUrls[0] ? 'Valid Blob' : 'Missing'}`);
}

async function testCompressTargetSize(page) {
  console.log("--- Testing Compress Image Target Size ---");
  await page.goto('http://localhost:3000/tools/compress-image-target-size');
  await page.setInputFiles('input[type="file"]', path.join(__dirname, 'test-source.jpg'));
  
  // Wait for the file to load and UI to show up
  await page.waitForSelector('input[type="number"]');
  // Fill target size 1 KB
  await page.fill('input[type="number"]', '1');
  await page.click('button:has-text("Compress Image")');
  
  await page.waitForSelector('text=Target Achieved', { timeout: 10000 });
  const resultText = await page.innerText('.bg-success\\/10');
  console.log(`Compression Result:\n${resultText.trim()}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  try {
    await testPdfInfo(page);
    await testExtractPdfText(page);
    await testExtractPdfImages(page);
    await testPdfToPng(page);
    await testCompressTargetSize(page);
    
    console.log("=== SUB-BATCH A VERIFICATION SUCCESSFUL ===");
  } catch(e) {
    console.error("Verification failed:", e);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
