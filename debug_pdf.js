const { PDFDocument, PDFRawStream, PDFName } = require('pdf-lib');
const fs = require('fs');

async function debugPdf() {
  const pdfBytes = fs.readFileSync('test-source.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const objects = pdfDoc.context.enumerateIndirectObjects();
  
  for (const [ref, obj] of objects) {
    if (obj instanceof PDFRawStream) {
      const subtype = obj.dict.lookup(PDFName.of('Subtype'));
      if (subtype) {
          console.log(`Subtype props: ${Object.keys(subtype)}`);
          console.log(`Subtype decodeText(): ${subtype.decodeText ? subtype.decodeText() : 'no'}`);
          console.log(`Subtype encodedName: ${subtype.encodedName}`);
      }
    }
  }
}
debugPdf();
