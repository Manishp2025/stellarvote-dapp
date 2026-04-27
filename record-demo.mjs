import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const URL = 'http://localhost:5173/';
const DESKTOP = 'C:\\Users\\harsh\\OneDrive\\Desktop';
const OUTPUT_DIR = path.join(DESKTOP, 'stellar-level3-final');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('🚀 Launching Professional Demo Recorder...');
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: { width: 1280, height: 720 },
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // 1. Visit App
  console.log('Navigating to StellarVote...');
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await sleep(5000); // Allow blobs to animate
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01-landing.png') });

  // 2. Demonstrate Glassmorphism (Scroll)
  console.log('Showing UI responsiveness...');
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await sleep(3000);
  await page.evaluate(() => window.scrollBy({ top: -300, behavior: 'smooth' }));
  await sleep(2000);

  // 3. Connect Wallet Interaction
  console.log('Interacting with Connect Wallet...');
  await page.hover('#connect-btn');
  await sleep(2000);
  await page.click('#connect-btn');
  await sleep(5000); // Simulate waiting for extension
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02-wallet-attempt.png') });

  // 4. Candidate Interaction
  console.log('Browsing candidates...');
  const cards = await page.$$('.candidate-card');
  if (cards.length > 0) {
    await cards[0].hover();
    await sleep(3000);
    const voteBtn = await cards[0].$('button');
    if (voteBtn) {
      await voteBtn.hover();
      await sleep(2000);
      await voteBtn.click();
      console.log('Waiting for transaction simulation...');
      await sleep(10000); // Wait 10s to show the status toast
    }
  }
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03-vote-flow.png') });

  // 5. Admin Panel
  console.log('Demonstrating Admin Controls...');
  await page.evaluate(() => document.querySelector('.admin-section').scrollIntoView({ behavior: 'smooth' }));
  await sleep(3000);
  
  await page.type('#candidate-input', 'Soroban Expert', { delay: 100 });
  await sleep(2000);
  await page.click('#add-candidate-btn');
  await sleep(8000); // Simulate block time
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04-admin-flow.png') });

  // 6. Final State
  console.log('Final review...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(5000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05-final-state.png') });

  console.log('\n✅ Demo Automation Finished!');
  console.log('Total Duration: ~60 seconds');
  console.log('Screenshots saved to:', OUTPUT_DIR);
  
  await sleep(2000);
  await browser.close();
  process.exit(0);
})();
