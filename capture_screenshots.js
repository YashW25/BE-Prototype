const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILES = {
  INVESTIGATOR: {
    id: 'usr-inv-002',
    full_name: 'Insp. Rajesh Varma',
    email: 'investigator@nyayavault.demo',
    role: 'INVESTIGATOR',
    department: 'Crime Investigation Dept (CID)',
    created_at: '2026-01-12T09:30:00Z',
    updated_at: '2026-01-12T09:30:00Z',
  },
  LEGAL: {
    id: 'usr-leg-003',
    full_name: 'Adv. Ananya Roy',
    email: 'legal@nyayavault.demo',
    role: 'LEGAL',
    department: 'Directorate of Public Prosecutions',
    created_at: '2026-01-15T11:00:00Z',
    updated_at: '2026-01-15T11:00:00Z',
  },
  FORENSIC: {
    id: 'usr-for-004',
    full_name: 'Dr. Suresh Nair',
    email: 'forensic@nyayavault.demo',
    role: 'FORENSIC',
    department: 'State Digital Forensic Laboratory',
    created_at: '2026-01-18T14:20:00Z',
    updated_at: '2026-01-18T14:20:00Z',
  },
  COURT: {
    id: 'usr-crt-005',
    full_name: 'Hon. Registrar P. K. Shastri',
    email: 'court@nyayavault.demo',
    role: 'COURT',
    department: 'District & Sessions Judiciary',
    created_at: '2026-01-20T16:00:00Z',
    updated_at: '2026-01-20T16:00:00Z',
  },
  ADMIN: {
    id: 'usr-admin-001',
    full_name: 'Dr. Vikrant Mehta',
    email: 'admin@nyayavault.demo',
    role: 'ADMIN',
    department: 'System Security & Oversight',
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-01-10T08:00:00Z',
  },
};

async function run() {
  console.log('Capturing rich styled screenshots of all NYAYAVAULT pages...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const capture = async (url, filename, profile) => {
    try {
      console.log(`Navigating to ${url}...`);
      await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
      
      if (profile) {
        await page.evaluate((p) => {
          localStorage.setItem('nyayavault_active_user', JSON.stringify(p));
        }, profile);
      }

      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const filePath = path.join(screenshotsDir, filename);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`✓ Saved styled screenshot: ${filename}`);
    } catch (err) {
      console.error(`Error capturing ${url}:`, err.message);
    }
  };

  // 1. Landing Page (Public)
  await capture('http://localhost:3000/', '01_landing_page.png', null);

  // 2. Login Page (Public)
  await capture('http://localhost:3000/login', '02_login_page.png', null);

  // 3. Investigator Dashboard
  await capture('http://localhost:3000/investigator', '03_investigator_dashboard.png', PROFILES.INVESTIGATOR);

  // 4. FIR Import Page
  await capture('http://localhost:3000/investigator/fir', '04_fir_import_page.png', PROFILES.INVESTIGATOR);

  // 5. Case Details Page
  await capture('http://localhost:3000/cases/case-001', '05_case_details_page.png', PROFILES.INVESTIGATOR);

  // 6. Document Verification Page
  await capture('http://localhost:3000/documents/doc-001/verify', '06_document_verification_page.png', PROFILES.INVESTIGATOR);

  // 7. System Audit Logs
  await capture('http://localhost:3000/audit', '07_system_audit_logs.png', PROFILES.INVESTIGATOR);

  // 8. Legal Dashboard
  await capture('http://localhost:3000/legal', '08_legal_dashboard.png', PROFILES.LEGAL);

  // 9. Forensic Dashboard
  await capture('http://localhost:3000/forensic', '09_forensic_dashboard.png', PROFILES.FORENSIC);

  // 10. Court Dashboard
  await capture('http://localhost:3000/court', '10_court_dashboard.png', PROFILES.COURT);

  // 11. Admin Dashboard
  await capture('http://localhost:3000/admin', '11_admin_dashboard.png', PROFILES.ADMIN);

  await browser.close();
  console.log('All styled screenshots captured successfully!');
}

run();
