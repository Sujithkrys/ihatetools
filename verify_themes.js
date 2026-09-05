const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const pagesToTest = [
  { name: 'homepage', url: 'http://localhost:3000/' },
  { name: 'all-tools', url: 'http://localhost:3000/tools' },
  { name: 'extract-pdf-images', url: 'http://localhost:3000/tools/extract-pdf-images' },
  { name: 'compress-image', url: 'http://localhost:3000/tools/compress-image' },
  { name: 'json-formatter', url: 'http://localhost:3000/tools/json-formatter' }
];

async function main() {
  const browser = await chromium.launch();
  
  for (const pageInfo of pagesToTest) {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log(`Navigating to ${pageInfo.name}...`);
    await page.goto(pageInfo.url);
    await page.waitForLoadState('networkidle');

    // Force Light Mode
    await page.evaluate(() => {
      window.localStorage.setItem('theme', 'light');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Give JS time to apply classes
    await page.screenshot({ path: path.join(__dirname, `${pageInfo.name}_light.png`), fullPage: true });
    
    // Force Dark Mode
    await page.evaluate(() => {
      window.localStorage.setItem('theme', 'dark');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(__dirname, `${pageInfo.name}_dark.png`), fullPage: true });

    await context.close();
  }
  
  await browser.close();
  console.log("Screenshots captured!");
}

main().catch(console.error);
