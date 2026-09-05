const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function prepFiles() {
  console.log("Preparing test files...");

  const imgPath = path.join(__dirname, 'test-source.jpg');
  const sourceImgPath = 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\e7d738e0-4486-4801-991d-84889fb0463d\\test_source_image_1788585376662.jpg';
  
  fs.copyFileSync(sourceImgPath, imgPath);
  console.log("Copied test-source.jpg");

  const imgBuffer = fs.readFileSync(imgPath);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle("Verification Test PDF");
  pdfDoc.setAuthor("Antigravity Agent");
  
  const page1 = pdfDoc.addPage([500, 500]);
  page1.drawText("This is the exact text we expect to extract.", { x: 50, y: 400 });
  
  const page2 = pdfDoc.addPage([500, 500]);
  const embeddedImage = await pdfDoc.embedJpg(imgBuffer);
  page2.drawImage(embeddedImage, { x: 100, y: 100, width: 200, height: 200 });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(__dirname, 'test-source.pdf'), pdfBytes);
  console.log("Created test-source.pdf");
  
  const emptyPdf = await PDFDocument.create();
  emptyPdf.addPage([200, 200]);
  fs.writeFileSync(path.join(__dirname, 'test-empty.pdf'), await emptyPdf.save());
  console.log("Created test-empty.pdf");
  
  // Create a JSON test file
  fs.writeFileSync(path.join(__dirname, 'test-broken.json'), '{ "broken": "json", }');
  
  // Create test strings for diff
  fs.writeFileSync(path.join(__dirname, 'test-diff-1.txt'), 'Hello world, this is original text.\nLine 2.');
  fs.writeFileSync(path.join(__dirname, 'test-diff-2.txt'), 'Hello world, this is updated text.\nLine 2.');

  console.log("Done.");
}

prepFiles();
