const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Wait for fonts to load
  
  // Screenshot the hero section
  const heroLocator = page.locator('section').first();
  await heroLocator.screenshot({ path: path.join(__dirname, 'hero_geist.png') });
  
  await browser.close();
  console.log('Screenshot captured!');
}

main().catch(console.error);
