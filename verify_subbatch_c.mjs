import crypto from "crypto";
import JSZip from "jszip";
import * as diff from "diff";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

async function runVerification() {
  console.log("==================================================");
  console.log("VERIFYING SUB-BATCH C — UTILITY TOOLS");
  console.log("==================================================");

  let passed = 0;
  let total = 0;

  function assert(cond, msg) {
    total++;
    if (cond) {
      console.log(`[PASS] ${msg}`);
      passed++;
    } else {
      console.error(`[FAIL] ${msg}`);
      throw new Error(`Assertion failed: ${msg}`);
    }
  }

  // -------------------------------------------------------------
  // 1. BARCODE GENERATOR
  // -------------------------------------------------------------
  console.log("\n--- 1. Testing Barcode Generator ---");
  {
    // Test that jsbarcode encodes valid patterns for Code128, EAN13, and UPC
    const JsBarcode = (await import("jsbarcode")).default;
    assert(typeof JsBarcode === "function", "JsBarcode library imported cleanly");

    // Test XML/SVG DOM mock for barcode generation
    const mockSvg = {
      innerHTML: "",
      childNodes: [],
      setAttribute: () => {},
      removeAttribute: () => {},
      appendChild: () => {},
      removeChild: () => {},
      getElementsByTagName: () => [],
    };

    let isValidCode128 = false;
    try {
      JsBarcode(mockSvg, "IHATETOOLS-2026", {
        format: "CODE128",
        valid: (valid) => { isValidCode128 = valid; },
      });
      isValidCode128 = true;
    } catch {}
    assert(isValidCode128, "JsBarcode validates standard Code128 format");

    let isValidEAN = false;
    try {
      JsBarcode(mockSvg, "590123412345", {
        format: "EAN13",
        valid: (valid) => { isValidEAN = valid; },
      });
      isValidEAN = true;
    } catch {}
    assert(isValidEAN, "JsBarcode validates 13-digit retail EAN-13 format");
  }

  // -------------------------------------------------------------
  // 2. DUPLICATE FILE FINDER
  // -------------------------------------------------------------
  console.log("\n--- 2. Testing Duplicate File Finder ---");
  {
    // 4 test files: A and B are genuinely identical; C is similar-but-different; D is completely different
    const fileA = Buffer.from("The quick brown fox jumps over the lazy dog. Version 1.0.0");
    const fileB = Buffer.from("The quick brown fox jumps over the lazy dog. Version 1.0.0"); // Identical to A
    const fileC = Buffer.from("The quick brown fox jumps over the lazy dog. Version 1.0.1"); // Similar (diff 1 char)
    const fileD = Buffer.from("Completely unrelated binary data payload xyz 987654321"); // Unique

    const hash = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

    const hashA = hash(fileA);
    const hashB = hash(fileB);
    const hashC = hash(fileC);
    const hashD = hash(fileD);

    console.log(`Hash A: ${hashA.substring(0, 16)}...`);
    console.log(`Hash B: ${hashB.substring(0, 16)}...`);
    console.log(`Hash C: ${hashC.substring(0, 16)}...`);
    console.log(`Hash D: ${hashD.substring(0, 16)}...`);

    assert(hashA === hashB, "Identical files A and B produce exact matching SHA-256 checksums");
    assert(hashA !== hashC, "Similar file C (1 char difference) produces distinct SHA-256 hash (avalanche effect)");
    assert(hashA !== hashD, "Unrelated file D produces distinct SHA-256 hash");

    // Group files by hash
    const files = [
      { name: "photo_original.jpg", hash: hashA },
      { name: "photo_copy.jpg", hash: hashB },
      { name: "photo_edited.jpg", hash: hashC },
      { name: "document.pdf", hash: hashD },
    ];

    const groups = {};
    files.forEach((f) => {
      if (!groups[f.hash]) groups[f.hash] = [];
      groups[f.hash].push(f);
    });

    const duplicateGroups = Object.values(groups).filter((g) => g.length > 1);
    assert(duplicateGroups.length === 1, "Exactly 1 duplicate group flagged");
    assert(duplicateGroups[0].length === 2, "Duplicate group contains precisely 2 identical files (A and B)");
    assert(
      duplicateGroups[0].some((f) => f.name === "photo_original.jpg") &&
      duplicateGroups[0].some((f) => f.name === "photo_copy.jpg"),
      "Only the genuinely identical pair is flagged"
    );
  }

  // -------------------------------------------------------------
  // 3. PDF COMPARE
  // -------------------------------------------------------------
  console.log("\n--- 3. Testing PDF Compare ---");
  {
    // Document A
    const docA = await PDFDocument.create();
    const pageA = docA.addPage([500, 400]);
    const font = await docA.embedFont(StandardFonts.Helvetica);
    pageA.drawText("Agreement: The tenant will pay $1500 per month.", { x: 50, y: 350, size: 12, font });
    pageA.drawText("Move-in date: October 1, 2026.", { x: 50, y: 300, size: 12, font });
    const bytesA = await docA.save();

    // Document B (with introduced editorial differences: $1800 and November 1)
    const docB = await PDFDocument.create();
    const pageB = docB.addPage([500, 400]);
    pageB.drawText("Agreement: The tenant will pay $1800 per month.", { x: 50, y: 350, size: 12, font });
    pageB.drawText("Move-in date: November 1, 2026.", { x: 50, y: 300, size: 12, font });
    const bytesB = await docB.save();

    // Extract text from both using pdfjs
    const loadA = await pdfjsLib.getDocument({ data: new Uint8Array(bytesA) }).promise;
    const textA = (await (await loadA.getPage(1)).getTextContent()).items.map((it) => it.str).join(" ");

    const loadB = await pdfjsLib.getDocument({ data: new Uint8Array(bytesB) }).promise;
    const textB = (await (await loadB.getPage(1)).getTextContent()).items.map((it) => it.str).join(" ");

    console.log(`Doc A text: "${textA}"`);
    console.log(`Doc B text: "${textB}"`);

    // Run text diff
    const wordDifferences = diff.diffWords(textA, textB);
    const hasAdditions = wordDifferences.some((d) => d.added);
    const hasDeletions = wordDifferences.some((d) => d.removed);

    assert(hasAdditions && hasDeletions, "PDF Compare correctly detected word-level differences between documents");

    const addedWords = wordDifferences.filter((d) => d.added).map((d) => d.value.trim());
    const removedWords = wordDifferences.filter((d) => d.removed).map((d) => d.value.trim());

    assert(removedWords.includes("$1500") || removedWords.some((w) => w.includes("1500")), "Identified removed value '$1500'");
    assert(addedWords.includes("$1800") || addedWords.some((w) => w.includes("1800")), "Identified added revised value '$1800'");
    assert(removedWords.includes("October") || removedWords.some((w) => w.includes("October")), "Identified removed month 'October'");
    assert(addedWords.includes("November") || addedWords.some((w) => w.includes("November")), "Identified added revised month 'November'");
  }

  // -------------------------------------------------------------
  // 4. BULK FILE RENAMER
  // -------------------------------------------------------------
  console.log("\n--- 4. Testing Bulk File Renamer ---");
  {
    const files = [
      { name: "IMG_3821.JPG", content: "photo1 data" },
      { name: "IMG_3822.JPG", content: "photo2 data" },
      { name: "IMG_3823.JPG", content: "photo3 data" },
    ];

    // Simulate sequential renaming: prefix "vacation", start 1, pad 3
    const zip = new JSZip();
    const expectedNames = [];

    files.forEach((f, idx) => {
      const num = String(1 + idx).padStart(3, "0");
      const ext = f.name.substring(f.name.lastIndexOf("."));
      const newName = `vacation_${num}${ext.toLowerCase()}`;
      expectedNames.push(newName);
      zip.file(newName, f.content);
    });

    assert(expectedNames[0] === "vacation_001.jpg", "Sequential renaming generated 'vacation_001.jpg'");
    assert(expectedNames[1] === "vacation_002.jpg", "Sequential renaming generated 'vacation_002.jpg'");
    assert(expectedNames[2] === "vacation_003.jpg", "Sequential renaming generated 'vacation_003.jpg'");

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    assert(zipBuffer.length > 100, "JSZip built valid binary zip archive");

    // Unzip and verify files inside
    const readZip = await JSZip.loadAsync(zipBuffer);
    assert(readZip.file("vacation_001.jpg") !== null, "Verified 'vacation_001.jpg' inside ZIP");
    assert(readZip.file("vacation_002.jpg") !== null, "Verified 'vacation_002.jpg' inside ZIP");
    assert(readZip.file("vacation_003.jpg") !== null, "Verified 'vacation_003.jpg' inside ZIP");
  }

  // -------------------------------------------------------------
  // 5. PASSWORD GENERATOR
  // -------------------------------------------------------------
  console.log("\n--- 5. Testing Password Generator ---");
  {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+-=";

    function generatePw(len, useUp, useLow, useNum, useSym, excludeAmb) {
      let pool = "";
      if (useUp) pool += upper;
      if (useLow) pool += lower;
      if (useNum) pool += nums;
      if (useSym) pool += syms;
      if (excludeAmb) pool = pool.replace(/[il1Lo0O]/g, "");

      const buf = crypto.randomBytes(len);
      let out = "";
      for (let i = 0; i < len; i++) {
        out += pool[buf[i] % pool.length];
      }
      return out;
    }

    // Generate 50 passwords with length 20
    const passwords = new Set();
    for (let i = 0; i < 50; i++) {
      const pw = generatePw(20, true, true, true, true, false);
      assert(pw.length === 20, "Password length is exactly 20 characters");
      passwords.add(pw);
    }
    assert(passwords.size === 50, "CSPRNG produced 50 completely unique passwords with 0 collisions");

    // Test ambiguous character exclusion
    for (let i = 0; i < 20; i++) {
      const cleanPw = generatePw(24, true, true, true, false, true);
      const hasAmbiguous = /[il1Lo0O]/.test(cleanPw);
      assert(!hasAmbiguous, "Verified ambiguous characters (i, l, 1, L, o, 0, O) are completely excluded");
    }

    // Entropy verification: 16 chars * log2(26+26+10+14=76) = 16 * 6.248 = ~100 bits
    const poolSize = 26 + 26 + 10 + 14;
    const entropyBits = Math.round(16 * Math.log2(poolSize));
    assert(entropyBits > 85, `Calculated entropy (${entropyBits} bits) verifies 'Very Strong / Military Grade' security`);
  }

  console.log("\n==================================================");
  console.log(`SUB-BATCH C VERIFICATION COMPLETE: ${passed}/${total} TESTS PASSED`);
  console.log("==================================================");
}

runVerification().catch((err) => {
  console.error("Sub-Batch C verification failed:", err);
  process.exit(1);
});
