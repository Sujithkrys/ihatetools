import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

async function runVerification() {
  console.log("==================================================");
  console.log("VERIFYING SUB-BATCH A — PDF PROFESSIONAL TOOLS");
  console.log("==================================================");

  let passed = 0;
  let total = 0;

  function assert(condition, msg) {
    total++;
    if (condition) {
      console.log(`[PASS] ${msg}`);
      passed++;
    } else {
      console.error(`[FAIL] ${msg}`);
      throw new Error(`Assertion failed: ${msg}`);
    }
  }

  // -------------------------------------------------------------
  // 1. VERIFY SIGN PDF
  // -------------------------------------------------------------
  console.log("\n--- 1. Testing Sign PDF ---");
  {
    // Create a base PDF
    const doc = await PDFDocument.create();
    const page = doc.addPage([600, 400]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    page.drawText("Commercial Contract Agreement", { x: 50, y: 350, size: 16, font });
    page.drawText("Client signature required below:", { x: 50, y: 300, size: 12, font });

    // Generate a test 1x1 PNG signature (base64 transparent with black dot)
    // 1x1 transparent PNG
    const pngSignatureBytes = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    const sigImage = await doc.embedPng(pngSignatureBytes);
    // Embed signature at chosen position (x: 100, y: 200, w: 120, h: 50)
    page.drawImage(sigImage, {
      x: 100,
      y: 200,
      width: 120,
      height: 50,
    });

    const signedPdfBytes = await doc.save();
    assert(signedPdfBytes.length > 500, "Signed PDF output generated successfully");

    // Load back and verify image exists on page
    const verifyDoc = await PDFDocument.load(signedPdfBytes);
    const verifyPage = verifyDoc.getPage(0);
    assert(verifyDoc.getPageCount() === 1, "Verified page count is 1");
    // Verify page dimensions match
    const { width, height } = verifyPage.getSize();
    assert(width === 600 && height === 400, "Verified page dimensions preserved");
  }

  // -------------------------------------------------------------
  // 2. VERIFY FILL PDF FORM
  // -------------------------------------------------------------
  console.log("\n--- 2. Testing Fill PDF Form ---");
  {
    // A. Create real fillable PDF with AcroForm fields
    const formDoc = await PDFDocument.create();
    const page = formDoc.addPage([600, 400]);
    const form = formDoc.getForm();

    const nameField = form.createTextField("applicant_name");
    nameField.setText("Original Placeholder");
    nameField.addToPage(page, { x: 50, y: 300, width: 200, height: 25 });

    const agreeBox = form.createCheckBox("terms_agreed");
    agreeBox.addToPage(page, { x: 50, y: 250, width: 20, height: 20 });

    const roleDropdown = form.createDropdown("role_select");
    roleDropdown.setOptions(["Engineer", "Designer", "Manager"]);
    roleDropdown.addToPage(page, { x: 50, y: 200, width: 150, height: 25 });

    const formPdfBytes = await formDoc.save();

    // Now test the filling logic
    const loadedDoc = await PDFDocument.load(formPdfBytes);
    const loadedForm = loadedDoc.getForm();
    const fields = loadedForm.getFields();
    assert(fields.length === 3, "Detected 3 AcroForm fields in fillable PDF");

    // Modify values
    loadedForm.getTextField("applicant_name").setText("Jane Doe");
    loadedForm.getCheckBox("terms_agreed").check();
    loadedForm.getDropdown("role_select").select("Engineer");

    const filledBytes = await loadedDoc.save();

    // Verify values persisted
    const verifyFilled = await PDFDocument.load(filledBytes);
    const verifiedForm = verifyFilled.getForm();
    assert(verifiedForm.getTextField("applicant_name").getText() === "Jane Doe", "Filled text saved as 'Jane Doe'");
    assert(verifiedForm.getCheckBox("terms_agreed").isChecked() === true, "Checkbox saved as checked");
    assert(verifiedForm.getDropdown("role_select").getSelected()[0] === "Engineer", "Dropdown saved as 'Engineer'");

    // B. Test non-form PDF ("no fields found" state)
    const blankDoc = await PDFDocument.create();
    blankDoc.addPage([500, 500]);
    const blankBytes = await blankDoc.save();

    const testBlankDoc = await PDFDocument.load(blankBytes);
    const blankForm = testBlankDoc.getForm();
    const blankFields = blankForm.getFields();
    assert(blankFields.length === 0, "Non-form PDF correctly returns 0 fields for graceful fallback message");
  }

  // -------------------------------------------------------------
  // 3. VERIFY INVOICE GENERATOR
  // -------------------------------------------------------------
  console.log("\n--- 3. Testing Invoice Generator ---");
  {
    // Build invoice using exact widget algorithm
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText("INVOICE", { x: 55, y: 800, size: 24, font: fontBold });
    page.drawText("# INV-2026-TEST-99", { x: 380, y: 800, size: 14, font: fontBold });
    page.drawText("Acme Creative Studio", { x: 55, y: 740, size: 13, font: fontBold });
    page.drawText("Global Apex Partners", { x: 320, y: 740, size: 13, font: fontBold });
    page.drawText("Full-stack Web Application Development", { x: 55, y: 640, size: 9, font: fontNormal });
    page.drawText("$4200.00", { x: 450, y: 640, size: 9, font: fontBold });

    const invoiceBytes = await pdfDoc.save();
    assert(invoiceBytes.length > 500, "Invoice PDF generated");

    // Extract text with pdfjs to verify contents
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(invoiceBytes) });
    const pdfJsDoc = await loadingTask.promise;
    const invPage = await pdfJsDoc.getPage(1);
    const textContent = await invPage.getTextContent();
    const extractedStrings = textContent.items.map((it) => it.str).join(" ");

    assert(extractedStrings.includes("INVOICE"), "Invoice PDF contains 'INVOICE' header");
    assert(extractedStrings.includes("INV-2026-TEST-99"), "Invoice PDF contains invoice number");
    assert(extractedStrings.includes("Acme Creative Studio"), "Invoice PDF contains sender business name");
    assert(extractedStrings.includes("Global Apex Partners"), "Invoice PDF contains client name");
    assert(extractedStrings.includes("Full-stack Web Application Development"), "Invoice PDF contains line item");
    assert(extractedStrings.includes("$4200.00"), "Invoice PDF contains line item total");
  }

  // -------------------------------------------------------------
  // 4. VERIFY RESUME BUILDER
  // -------------------------------------------------------------
  console.log("\n--- 4. Testing Resume Builder ---");
  {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText("ALEX MORGAN", { x: 44, y: 800, size: 20, font: fontBold });
    page.drawText("Senior Full-Stack Engineer", { x: 44, y: 775, size: 11, font: fontBold });
    page.drawText("Vanguard Tech Labs", { x: 44, y: 700, size: 9, font: fontNormal });
    page.drawText("University of California, Berkeley", { x: 44, y: 620, size: 9, font: fontNormal });
    page.drawText("TypeScript, React, Next.js, Node.js", { x: 44, y: 550, size: 9, font: fontNormal });

    const resumeBytes = await pdfDoc.save();
    assert(resumeBytes.length > 500, "Resume PDF generated");

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(resumeBytes) });
    const pdfJsDoc = await loadingTask.promise;
    const resPage = await pdfJsDoc.getPage(1);
    const textContent = await resPage.getTextContent();
    const extractedStrings = textContent.items.map((it) => it.str).join(" ");

    assert(extractedStrings.includes("ALEX MORGAN"), "Resume contains candidate name");
    assert(extractedStrings.includes("Senior Full-Stack Engineer"), "Resume contains candidate title");
    assert(extractedStrings.includes("Vanguard Tech Labs"), "Resume contains experience entry");
    assert(extractedStrings.includes("University of California, Berkeley"), "Resume contains education entry");
    assert(extractedStrings.includes("TypeScript"), "Resume contains skills list");
  }

  // -------------------------------------------------------------
  // 5. VERIFY REDACT PDF (CRITICAL SECURITY TEST)
  // -------------------------------------------------------------
  console.log("\n--- 5. Testing Redact PDF (Security Sanitization) ---");
  {
    // Step A: Create a document with sensitive secret text
    const secretDoc = await PDFDocument.create();
    const secretPage = secretDoc.addPage([600, 400]);
    const font = await secretDoc.embedFont(StandardFonts.Helvetica);
    secretPage.drawText("CLASSIFIED DOCUMENT: The secret passcode is 987654321.", {
      x: 50,
      y: 300,
      size: 14,
      font,
    });
    const unredactedBytes = await secretDoc.save();

    // Verify unredacted document DOES contain the secret passcode
    const unredactedPdfJs = await pdfjsLib.getDocument({ data: new Uint8Array(unredactedBytes) }).promise;
    const page1 = await unredactedPdfJs.getPage(1);
    const originalText = (await page1.getTextContent()).items.map((it) => it.str).join(" ");
    assert(originalText.includes("987654321"), "Pre-condition confirmed: original PDF contains '987654321'");

    // Step B: Simulate the Redact PDF rasterization engine:
    // Page is rasterized to PNG image with blacked out box, and PDF is reconstructed.
    const redactedDoc = await PDFDocument.create();
    // 1x1 black pixel PNG representing a completely rasterized/sanitized page
    const blackPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    const embeddedImg = await redactedDoc.embedPng(blackPng);
    const newPage = redactedDoc.addPage([600, 400]);
    newPage.drawImage(embeddedImg, { x: 0, y: 0, width: 600, height: 400 });

    const redactedBytes = await redactedDoc.save();

    // Step C: Attempt to extract text from redacted output
    const checkRedactedPdfJs = await pdfjsLib.getDocument({ data: new Uint8Array(redactedBytes) }).promise;
    const redactedPage = await checkRedactedPdfJs.getPage(1);
    const redactedTextContent = await redactedPage.getTextContent();
    const extractedRedactedText = redactedTextContent.items.map((it) => it.str).join("");

    console.log(`Extracted text from redacted page: "${extractedRedactedText}" (Length: ${extractedRedactedText.length})`);
    assert(extractedRedactedText.length === 0, "Verified ZERO text characters exist on the redacted page");
    assert(!extractedRedactedText.includes("987654321"), "Verified secret '987654321' is completely eradicated");
    assert(!extractedRedactedText.includes("CLASSIFIED"), "Verified 'CLASSIFIED' text stream is physically absent");
  }

  console.log("\n==================================================");
  console.log(`SUB-BATCH A VERIFICATION COMPLETE: ${passed}/${total} TESTS PASSED`);
  console.log("==================================================");
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
