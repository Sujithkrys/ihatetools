const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');
const { PDFDocument } = require('pdf-lib');
const sizeOf = require('image-size').imageSize;
const QrCode = require('qrcode-reader');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  
  try {
    console.log("=== 1. Testing PDF to JPG ===");
    await page.goto('http://localhost:3000/tools/pdf-to-jpg', { waitUntil: 'networkidle' });
    const locator1 = page.locator('input[type="file"]');
    await locator1.waitFor({ state: 'attached' });
    await locator1.setInputFiles('test-multipage.pdf');
    
    // Wait for the download link to appear and click it
    await page.waitForSelector('a[download]');
    const downloadPromise1 = page.waitForEvent('download');
    await page.click('a[download]');
    const download = await downloadPromise1;
    const downloadPath = await download.path();
    
    const zipData = fs.readFileSync(downloadPath);
    const zip = await JSZip.loadAsync(zipData);
    const files = Object.keys(zip.files);
    console.log("Downloaded ZIP files:", files);
    if(files.length !== 3) throw new Error("Expected 3 JPGs in ZIP");
    
    const imgBuffer = await zip.files[files[0]].async("nodebuffer");
    fs.writeFileSync('test1.jpg', imgBuffer);
    const imgBuffer2 = await zip.files[files[1]].async("nodebuffer");
    fs.writeFileSync('test2.jpg', imgBuffer2);
    
    const img = sizeOf(imgBuffer);
    console.log(`Extracted JPG 1 dimensions: ${img.width}x${img.height}`);
    if(img.width === 0) throw new Error("Image width is 0!");
    console.log("PDF TO JPG: OK");
    
    console.log("\n=== 2. Testing Images to PDF ===");
    await page.goto('http://localhost:3000/tools/images-to-pdf', { waitUntil: 'networkidle' });
    const locator2 = page.locator('input[type="file"]');
    await locator2.waitFor({ state: 'attached' });
    await locator2.setInputFiles(['test1.jpg', 'test2.jpg']);
    await page.click('button:has-text("Generate PDF")');
    
    await page.waitForSelector('a[download]');
    const downloadPromise2 = page.waitForEvent('download');
    await page.click('a[download]');
    const download2 = await downloadPromise2;
    const downloadPath2 = await download2.path();
    
    const pdfBytes = fs.readFileSync(downloadPath2);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    console.log("Generated PDF pages:", pdfDoc.getPageCount());
    if(pdfDoc.getPageCount() !== 2) throw new Error("Expected 2 pages in PDF");
    console.log("IMAGES TO PDF: OK");
    
    console.log("\n=== 3. Testing Add Watermark ===");
    await page.goto('http://localhost:3000/tools/add-watermark', { waitUntil: 'networkidle' });
    const locator3 = page.locator('input[type="file"]');
    await locator3.waitFor({ state: 'attached' });
    await locator3.setInputFiles('test-multipage.pdf');
    
    await page.fill('input[placeholder="CONFIDENTIAL"]', 'E2E_WATERMARK_TEST');
    await page.click('button:has-text("Apply Watermark")');
    
    await page.waitForSelector('a[download]');
    const downloadPromise3 = page.waitForEvent('download');
    await page.click('a[download]');
    const download3 = await downloadPromise3;
    const downloadPath3 = await download3.path();
    
    const pdfBytes3 = fs.readFileSync(downloadPath3);
    console.log("Watermarked PDF generated, size:", pdfBytes3.length);
    if(pdfBytes3.length < 1000) throw new Error("Watermarked PDF seems empty");
    console.log("ADD WATERMARK: OK");
    
    console.log("\n=== 4. Testing Crop Image ===");
    await page.goto('http://localhost:3000/tools/crop-image', { waitUntil: 'networkidle' });
    const locator4 = page.locator('input[type="file"]');
    await locator4.waitFor({ state: 'attached' });
    await locator4.setInputFiles('test1.jpg');
    
    const cropImg = await page.waitForSelector('.ReactCrop img');
    const box = await cropImg.boundingBox();
    // Simulate drawing a crop box
    await page.mouse.move(box.x + 10, box.y + 10);
    await page.mouse.down();
    await page.mouse.move(box.x + 150, box.y + 100);
    await page.mouse.up();
    
    await page.waitForTimeout(500); // let state settle
    await page.click('button:has-text("Apply Crop")');
    
    await page.waitForSelector('a[download]');
    const downloadPromise4 = page.waitForEvent('download');
    await page.click('a[download]');
    const download4 = await downloadPromise4;
    const downloadPath4 = await download4.path();
    
    const croppedImgBuffer = fs.readFileSync(downloadPath4);
    const croppedImg = sizeOf(croppedImgBuffer);
    console.log(`Cropped JPG dimensions: ${croppedImg.width}x${croppedImg.height}`);
    if(croppedImg.width >= 350) throw new Error("Image was not cropped!");
    console.log("CROP IMAGE: OK");
    
    console.log("\n=== 5. Testing QR Code ===");
    await page.goto('http://localhost:3000/tools/qr-code-generator', { waitUntil: 'networkidle' });
    await page.fill('textarea', 'https://example.com/e2e');
    
    await page.waitForTimeout(1000); // Wait for debounce
    
    const downloadPromise5 = page.waitForEvent('download');
    await page.click('button:has-text("Download PNG")');
    const download5 = await downloadPromise5;
    const downloadPath5 = await download5.path();
    
    const JimpModule = require('jimp'); // dynamic import
    const qrImg = await JimpModule.read(downloadPath5);
    const qr = new QrCode();
    const value = await new Promise((resolve, reject) => {
      qr.callback = function(err, v) {
        if(err) resolve(null); else resolve(v.result);
      };
      qr.decode(qrImg.bitmap);
    });
    console.log("Decoded QR Code value:", value);
    if(value !== 'https://example.com/e2e') throw new Error("QR code failed to decode properly");
    console.log("QR CODE: OK");
    
    console.log("\nALL TESTS PASSED PROGRAMMATICALLY!");
  } catch(e) {
    console.error("TEST FAILED:", e);
  } finally {
    await browser.close();
  }
})();
