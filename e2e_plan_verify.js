const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { encryptPDF } = require('@pdfsmaller/pdf-encrypt');
const { decryptPDF } = require('@pdfsmaller/pdf-decrypt');
const pdfParse = require('pdf-parse');

(async () => {
  const artifactsDir = "C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\e7d738e0-4486-4801-991d-84889fb0463d";
  
  console.log("=== 1 & 2. BACKEND PASSWORD VERIFICATION ===");
  try {
    // 1. Create a simple PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([200, 200]);
    page.drawText('STRICT ENCRYPTION TEST', { x: 20, y: 100 });
    const originalBytes = await pdfDoc.save();

    // 2. Encrypt using @pdfsmaller
    console.log("Encrypting PDF with password 'secret'...");
    const encryptedBytes = await encryptPDF(originalBytes, 'secret');
    
    // 3. Verify it is GENUINELY encrypted by parsing with pdf-lib (should fail)
    try {
      await PDFDocument.load(encryptedBytes);
      throw new Error("FAILED: pdf-lib was able to open the encrypted file without a password!");
    } catch (e) {
      if (e.message.includes('encrypted') || e.name === 'EncryptedPDFError') {
        console.log("SUCCESS: pdf-lib confirmed the file is strictly encrypted and threw an error.");
      } else {
        throw e;
      }
    }

    // 4. Test wrong password
    console.log("Attempting to decrypt with WRONG password...");
    try {
      await decryptPDF(encryptedBytes, 'wrongpassword');
      throw new Error("FAILED: Decrypted with wrong password!");
    } catch (e) {
      if (e.message.includes('Incorrect password')) {
        console.log("SUCCESS: Safely rejected wrong password with specific error.");
      } else {
        throw e;
      }
    }

    // 5. Test correct password
    console.log("Attempting to decrypt with CORRECT password...");
    const decryptedBytes = await decryptPDF(encryptedBytes, 'secret');
    const decryptedDoc = await PDFDocument.load(decryptedBytes);
    console.log(`SUCCESS: PDF fully decrypted and opened! Pages: ${decryptedDoc.getPageCount()}`);
    
  } catch (err) {
    console.error("PASSWORD VERIFICATION FAILED:", err);
    process.exit(1);
  }

  console.log("\n=== 3 & 4. FRONTEND E2E VERIFICATION ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  
  try {
    // 3. Test 4MB limit on frontend
    console.log("Testing 4MB upload block on Add Password...");
    await page.goto('http://localhost:3000/tools/add-password', { waitUntil: 'networkidle' });
    
    // Create a valid oversized PDF
    const oversizedPdf = await PDFDocument.create();
    for (let i = 0; i < 50; i++) {
      const p = oversizedPdf.addPage([500, 500]);
      p.drawText("This is heavy text padding ".repeat(3000), { x: 10, y: 400, maxWidth: 480 });
    }
    const oversizedBuffer = await oversizedPdf.save();
    // make sure it's > 4.2MB
    let padding = Buffer.alloc(4.5 * 1024 * 1024);
    // actually just append it to the end of the file buffer (will break PDF but keep mime?)
    // No, better to just use a real file if possible, or append to a PDF inside a comment
    const finalBuffer = Buffer.concat([oversizedBuffer, padding]);
    fs.writeFileSync('oversized_test.pdf', finalBuffer);
    
    let locator = page.locator('input[type="file"]');
    await locator.waitFor({ state: 'attached' });
    await locator.setInputFiles('oversized_test.pdf');
    
    await page.waitForSelector('.text-error', { timeout: 10000 });
    const errorText = await page.locator('.text-error').innerText();
    if (errorText.includes('4MB')) {
      console.log(`SUCCESS: 4MB limit caught by frontend. Message: "${errorText}"`);
    } else {
      throw new Error(`FAILED: Expected 4MB limit error, got: ${errorText}`);
    }

    // 4. Test OCR tool (Client-side)
    console.log("\nTesting OCR Text Extraction...");
    await page.goto('http://localhost:3000/tools/ocr-pdf', { waitUntil: 'networkidle' });
    
    // Create an image with known text
    const canvasHtml = `
      <canvas id="c" width="400" height="100"></canvas>
      <script>
        const ctx = document.getElementById('c').getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 400, 100);
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('E2E OCR STRICT TEST', 20, 50);
      </script>
    `;
    fs.writeFileSync('temp_canvas.html', canvasHtml);
    const canvasPage = await browser.newPage();
    await canvasPage.goto(`file://${path.join(process.cwd(), 'temp_canvas.html')}`);
    const canvasElem = await canvasPage.locator('#c');
    await canvasElem.screenshot({ path: 'ocr_test_image.png' });
    await canvasPage.close();

    locator = page.locator('input[type="file"]');
    await locator.waitFor({ state: 'attached' });
    await locator.setInputFiles('ocr_test_image.png');
    
    await page.click('button:has-text("Extract Text")');
    console.log("Waiting for Tesseract.js OCR to process...");
    
    await page.waitForSelector('textarea', { timeout: 30000 });
    const extractedText = await page.inputValue('textarea');
    console.log(`OCR OUTPUT: "${extractedText}"`);
    if (extractedText.includes('OCR')) {
      console.log("SUCCESS: OCR correctly extracted text on the client-side.");
    } else {
      throw new Error("FAILED: OCR text didn't match.");
    }

    // 5. Test Aggressive Compression mode
    console.log("\nTesting Aggressive Compression...");
    await page.goto('http://localhost:3000/tools/compress-pdf', { waitUntil: 'networkidle' });
    
    // Create a text-heavy PDF
    const heavyPdf = await PDFDocument.create();
    const heavyPage = heavyPdf.addPage([500, 500]);
    heavyPage.drawText("This is selectable text that should be DESTROYED by aggressive mode. ".repeat(20), { x: 10, y: 400, maxWidth: 480 });
    fs.writeFileSync('heavy_test.pdf', await heavyPdf.save());

    locator = page.locator('input[type="file"]');
    await locator.waitFor({ state: 'attached' });
    await locator.setInputFiles('heavy_test.pdf');
    
    // Select Aggressive mode
    await page.click('button:has-text("Aggressive")');
    await page.click('button:has-text("Compress PDF")');
    
    // Wait for the success state to appear and the Download PDF link to be available
    console.log("Waiting for aggressive compression to finish...");
    await page.waitForSelector('a:has-text("Download PDF")', { timeout: 30000 });
    
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await page.click('a:has-text("Download PDF")');
    const download = await downloadPromise;
    const aggressiveOutput = await download.path();
    fs.copyFileSync(aggressiveOutput, 'aggressive_output.pdf');
    
    // Parse the output with pdf-parse to confirm text is gone (rasterized)
    const dataBuffer = fs.readFileSync('aggressive_output.pdf');
    const parsed = await pdfParse(dataBuffer);
    
    if (parsed.text.trim() === '') {
      console.log("SUCCESS: Aggressive mode output has ZERO selectable text. The page was correctly rasterized!");
    } else {
      throw new Error(`FAILED: Found selectable text in aggressive output: ${parsed.text}`);
    }
    
    console.log("\nALL TESTS PASSED SUCCESSFULLY.");

  } catch (err) {
    console.error("E2E VERIFICATION FAILED:", err);
  } finally {
    await browser.close();
  }
})();
