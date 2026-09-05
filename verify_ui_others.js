const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testJsonFormatter(page) {
  console.log("--- Testing JSON Formatter ---");
  await page.goto('http://localhost:3000/tools/json-formatter');
  await page.fill('textarea', '{ "broken": "json", }'); // trailing comma is invalid JSON
  await page.click('button:has-text("Format")');
  
  await page.waitForSelector('div.bg-error\\/10 p.text-error');
  const errorText = await page.innerText('div.bg-error\\/10 p.text-error');
  console.log(`Received Error: "${errorText}"`);
  if (!errorText.toLowerCase().includes('json')) {
    throw new Error("Did not receive a clear JSON error message.");
  }
}

async function testTextDiff(page) {
  console.log("--- Testing Text Diff Checker ---");
  await page.goto('http://localhost:3000/tools/text-diff');
  // There are two textareas, we need to fill both.
  const textareas = await page.locator('textarea').all();
  await textareas[0].fill('Hello world, this is original text.\nLine 2.');
  await textareas[1].fill('Hello world, this is updated text.\nLine 2.');
  
  await page.click('button:has-text("Compare")');
  
  // Wait for the diff viewer to show up
  await page.waitForSelector('text=original');
  const additions = await page.locator('span.bg-success\\/20').allInnerTexts();
  const deletions = await page.locator('span.bg-error\\/20').allInnerTexts();
  console.log(`Additions: ${JSON.stringify(additions)}`);
  console.log(`Deletions: ${JSON.stringify(deletions)}`);
  
  if (!additions.join("").includes("updated") || !deletions.join("").includes("original")) {
    throw new Error("Diff failed to highlight exact differences (original vs updated).");
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await testJsonFormatter(page);
    await testTextDiff(page);
    console.log("=== JSON Formatter & Text Diff VERIFICATION SUCCESSFUL ===");
  } catch(e) {
    console.error("Verification failed:", e);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
