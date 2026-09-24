const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('Capturing real screenshots of all NYAYAVAULT pages...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const pagesToCapture = [
    { url: 'http://localhost:3000/', name: '01_landing_page.png' },
    { url: 'http://localhost:3000/login', name: '02_login_page.png' },
    { url: 'http://localhost:3000/investigator', name: '03_investigator_dashboard.png' },
    { url: 'http://localhost:3000/investigator/fir', name: '04_fir_import_page.png' },
    { url: 'http://localhost:3000/cases/case-001', name: '05_case_details_page.png' },
    { url: 'http://localhost:3000/documents/doc-001/verify', name: '06_document_verification_page.png' },
    { url: 'http://localhost:3000/audit', name: '07_system_audit_logs.png' },
    { url: 'http://localhost:3000/legal', name: '08_legal_dashboard.png' },
    { url: 'http://localhost:3000/forensic', name: '09_forensic_dashboard.png' },
    { url: 'http://localhost:3000/court', name: '10_court_dashboard.png' },
    { url: 'http://localhost:3000/admin', name: '11_admin_dashboard.png' },
  ];

  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  for (const item of pagesToCapture) {
    try {
      console.log(`Capturing ${item.name} from ${item.url}...`);
      await page.goto(item.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      const filePath = path.join(screenshotsDir, item.name);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Saved screenshot: ${filePath}`);
    } catch (err) {
      console.error(`Failed to capture ${item.url}:`, err.message);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run();
