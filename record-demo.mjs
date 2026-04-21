import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const URL = 'http://localhost:5173/';
const DESKTOP = 'C:\\Users\\harsh\\OneDrive\\Desktop';
const OUTPUT_DIR = path.join(DESKTOP, 'stellar-demo-screenshots');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: { width: 1280, height: 720 }
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  // Handle ALL dialogs automatically (close them immediately)
  page.on('dialog', async dialog => {
    console.log('Dialog dismissed:', dialog.message());
    await dialog.dismiss();
  });

  console.log('Navigating to dApp...');
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(3000);

  // Check what version is loaded
  const footerText = await page.$eval('footer', el => el.textContent).catch(() => 'not found');
  console.log('Footer version:', footerText);

  // Screenshot 1: Landing page
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01-landing.png') });
  console.log('Screenshot 1: Landing page');

  // Click Connect Wallet
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const connectBtn = buttons.find(b => b.textContent.includes('Connect Wallet') || b.id === 'connect-btn');
    if (connectBtn) connectBtn.click();
  });
  await sleep(2000);

  // Screenshot 2: After connect click
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02-after-connect.png') });
  console.log('Screenshot 2: After connect');

  // Check if wallet connected
  const walletText = await page.$eval('header button', el => el.textContent).catch(() => 'unknown');
  console.log('Wallet button text:', walletText);

  // Vote for Alpha 
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const voteBtn = buttons.find(b => b.textContent.trim() === 'Vote Now');
    if (voteBtn) voteBtn.click();
    else console.log('Vote button not found, trying outline buttons');
  });
  await sleep(2000);

  // Screenshot 3: After vote
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03-voted.png') });
  console.log('Screenshot 3: After vote');

  // Add Champion candidate
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="text"]');
    if (inputs.length > 0) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(inputs[0], 'Champion');
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await sleep(500);

  await page.evaluate(() => {
    const btn = document.getElementById('add-candidate-btn');
    if (btn) btn.click();
  });
  await sleep(1500);

  // Screenshot 4: Champion added
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04-champion-added.png') });
  console.log('Screenshot 4: Champion added');

  // Vote for Champion
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button.btn-outline'));
    if (buttons.length > 0) buttons[buttons.length - 1].click();
  });
  await sleep(2000);

  // Screenshot 5: Final state
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05-final.png'), fullPage: true });
  console.log('Screenshot 5: Final state');

  console.log('\n✅ Done! Screenshots saved to:', OUTPUT_DIR);
  await sleep(2000);
  await browser.close();
})();
