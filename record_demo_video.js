const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  const artifactsDir = 'C:\\Users\\yashw\\.gemini\\antigravity-ide\\brain\\5f645117-2a23-4382-a12f-ed32d0b4cc6c';
  
  console.log('Starting Playwright Chromium Video Recording...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: artifactsDir,
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  try {
    // 1. Landing Page
    console.log('Scene 1: Landing Page');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await delay(3500);

    // 2. Login Page
    console.log('Scene 2: Login Portal');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    await delay(2500);

    // 1-Click Instant Login
    const loginCard = page.locator('button:has-text("Insp. Rajesh Varma")');
    if (await loginCard.isVisible()) {
      await loginCard.click();
    } else {
      await page.click('button[type="submit"]');
    }
    await delay(3500);

    // 3. Investigator Dashboard
    console.log('Scene 3: Investigator Dashboard');
    await page.goto('http://localhost:3000/investigator', { waitUntil: 'networkidle' });
    await delay(3500);

    // 4. FIR Import Page
    console.log('Scene 4: FIR Import');
    await page.goto('http://localhost:3000/investigator/fir', { waitUntil: 'networkidle' });
    await delay(2000);
    await page.click('button[type="submit"]');
    await delay(3000);

    // Click Import button
    const importBtn = page.locator('button:has-text("IMPORT INTO NYAYAVAULT")');
    if (await importBtn.isVisible()) {
      await importBtn.click();
      await delay(3500);
    }

    // 5. Case Details & Document Verification
    console.log('Scene 5: Case Details & Verification');
    await page.goto('http://localhost:3000/cases/case-001', { waitUntil: 'networkidle' });
    await delay(3000);

    // 6. Document Verification
    console.log('Scene 6: Document Verification Page');
    await page.goto('http://localhost:3000/documents/doc-001/verify', { waitUntil: 'networkidle' });
    await delay(4000);

    // Simulate Tamper
    const tamperBtn = page.locator('button:has-text("Simulate 1-Bit File Alteration")');
    if (await tamperBtn.isVisible()) {
      await tamperBtn.click();
      await delay(3500);
      const restoreBtn = page.locator('button:has-text("Restore Original Hash")');
      if (await restoreBtn.isVisible()) {
        await restoreBtn.click();
        await delay(2500);
      }
    }

    // 7. System Audit Log
    console.log('Scene 7: System Audit Log');
    await page.goto('http://localhost:3000/audit', { waitUntil: 'networkidle' });
    await delay(3500);

    // 8. Role Dashboards
    console.log('Scene 8: Legal Dashboard');
    await page.goto('http://localhost:3000/legal', { waitUntil: 'networkidle' });
    await delay(2500);

    console.log('Scene 9: Forensic Dashboard');
    await page.goto('http://localhost:3000/forensic', { waitUntil: 'networkidle' });
    await delay(2500);

    console.log('Scene 10: Court & Admin Dashboards');
    await page.goto('http://localhost:3000/court', { waitUntil: 'networkidle' });
    await delay(2500);

    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
    await delay(3000);

    console.log('Walkthrough Completed Successfully!');
  } catch (err) {
    console.error('Error during video recording:', err);
  } finally {
    const videoPath = await page.video().path();
    await page.close();
    await context.close();
    await browser.close();

    console.log('VIDEO_RECORDING_PATH:', videoPath);
    
    // Rename to clean artifact name
    const targetPath = path.join(artifactsDir, 'nyayavault_project_demo.webm');
    if (fs.existsSync(videoPath)) {
      fs.copyFileSync(videoPath, targetPath);
      console.log('Copied video artifact to:', targetPath);
    }
  }
}

run();
