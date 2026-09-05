const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); 
  
  await page.screenshot({ path: path.join(__dirname, 'before_homepage.png'), fullPage: true });
  
  await browser.close();
  console.log('Before screenshot captured!');
}

main().catch(console.error);
