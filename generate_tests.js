const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPdf(name, text) {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  
  page.drawText(text, {
    x: 50,
    y: height - 100,
    size: 30,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(name, pdfBytes);
  console.log(`Created ${name}`);
}

async function run() {
  await createPdf('test1.pdf', 'This is the first test document.');
  await createPdf('test2.pdf', 'This is the SECOND test document.');
  // Also create a txt file for error testing
  fs.writeFileSync('test3.txt', 'This is just a text file');
}

run();
