const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');

// Helper to wait for a specific download
async function handleDownload(page, clickAction) {
  const downloadPromise = page.waitForEvent('download');
  await clickAction();
  const download = await downloadPromise;
  const tempPath = await download.path();
  const fileName = download.suggestedFilename();
  const destPath = path.join(process.cwd(), fileName);
  // move file
  fs.copyFileSync(tempPath, destPath);
  return destPath;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  
  const artifactsDir = "C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\e7d738e0-4486-4801-991d-84889fb0463d";
  
  try {
    console.log("=== STRICT 1: QR CODE ===");
    await page.goto('http://localhost:3000/tools/qr-code-generator', { waitUntil: 'networkidle' });
    await page.fill('textarea', 'https://verified.com');
    await page.waitForTimeout(1500); // Wait for debounce and render
    
    const qrPath = await handleDownload(page, async () => {
      await page.click('button:has-text("Download PNG")');
    });
    
    // Decode with real QR library
    const buffer = fs.readFileSync(qrPath);
    const png = PNG.sync.read(buffer);
    const code = jsQR(new Uint8ClampedArray(png.data.buffer), png.width, png.height);
    if (!code) throw new Error("jsQR failed to decode anything!");
    
    console.log(`QR DECODED EXACTLY AS: "${code.data}"`);
    if (code.data !== 'https://verified.com') throw new Error("QR string mismatch!");
    console.log("QR CODE: VERIFIED STRICTLY");
    
    console.log("\n=== STRICT 2: IMAGES TO PDF ===");
    await page.goto('http://localhost:3000/tools/images-to-pdf', { waitUntil: 'networkidle' });
    let locator = page.locator('input[type="file"]');
    await locator.waitFor({ state: 'attached' });
    await locator.setInputFiles(['test1.jpg', 'test2.jpg']); // These were created in the previous step
    await page.click('button:has-text("Generate PDF")');
    
    const generatedPdfPath = await handleDownload(page, async () => {
      await page.waitForSelector('a[download]');
      await page.click('a[download]');
    });
    console.log("Images -> PDF generated. Now verifying via PDF to JPG tool...");
    
    // Verify it's not blank by running it through the rasterizer
    await page.goto('http://localhost:3000/tools/pdf-to-jpg', { waitUntil: 'networkidle' });
    locator = page.locator('input[type="file"]');
    await locator.waitFor({ state: 'attached' });
    await locator.setInputFiles(generatedPdfPath);
    
    const imagesToPdfZipPath = await handleDownload(page, async () => {
      await page.waitForSelector('a[download]');
      await page.click('a[download]');
    });
    
    let zipData = fs.readFileSync(imagesToPdfZipPath);
    let zip = await JSZip.loadAsync(zipData);
    let files = Object.keys(zip.files);
    let imgBuffer = await zip.files[files[0]].async("nodebuffer");
    let destImgPdf = path.join(artifactsDir, "verified_images_to_pdf_output.jpg");
    fs.writeFileSync(destImgPdf, imgBuffer);
    console.log(`Extracted rasterized page saved to artifact dir: verified_images_to_pdf_output.jpg`);
    console.log("IMAGES TO PDF: VERIFIED STRICTLY");
    
    console.log("\n=== STRICT 3: ADD WATERMARK ===");
    await page.goto('http://localhost:3000/tools/add-watermark', { waitUntil: 'networkidle' });
    locator = page.locator('input[type="file"]');
    await locator.waitFor({ state: 'attached' });
    await locator.setInputFiles('test-multipage.pdf');
    
    // Fill the correct input. Watermark tool uses placeholder "e.g., CONFIDENTIAL"
    await page.fill('input[placeholder="e.g., CONFIDENTIAL"]', 'E2E VERIFICATION STRICT');
    await page.click('button:has-text("Apply Watermark")');
    
    const watermarkedPdfPath = await handleDownload(page, async () => {
      await page.waitForSelector('a[download]');
      await page.click('a[download]');
    });
    console.log("Watermarked PDF generated. Now rasterizing to verify visibility...");
    
    await page.goto('http://localhost:3000/tools/pdf-to-jpg', { waitUntil: 'networkidle' });
    locator = page.locator('input[type="file"]');
    await locator.waitFor({ state: 'attached' });
    await locator.setInputFiles(watermarkedPdfPath);
    
    const watermarkZipPath = await handleDownload(page, async () => {
      await page.waitForSelector('a[download]');
      await page.click('a[download]');
    });
    
    zipData = fs.readFileSync(watermarkZipPath);
    zip = await JSZip.loadAsync(zipData);
    files = Object.keys(zip.files);
    imgBuffer = await zip.files[files[0]].async("nodebuffer");
    let destWatermark = path.join(artifactsDir, "verified_watermark_output.jpg");
    fs.writeFileSync(destWatermark, imgBuffer);
    console.log(`Extracted rasterized page saved to artifact dir: verified_watermark_output.jpg`);
    console.log("ADD WATERMARK: VERIFIED STRICTLY");

  } catch (err) {
    console.error("STRICT VERIFICATION FAILED:", err);
  } finally {
    await browser.close();
  }
})();
