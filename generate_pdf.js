const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { chromium } = require('playwright');

async function buildPDF() {
  console.log('Generating publication-quality PDF for NYAYAVAULT EXPLANATION.md...');

  const explanationPath = path.join(__dirname, 'EXPLANATION.md');
  const markdownText = fs.readFileSync(explanationPath, 'utf-8');

  // Convert markdown to HTML
  let htmlContent = marked.parse(markdownText);

  // Replace screenshot paths with absolute file:// URLs for Chromium PDF renderer
  const screenshotsDir = path.join(__dirname, 'screenshots').replace(/\\/g, '/');
  htmlContent = htmlContent.replace(/src="screenshots\//g, `src="file:///${screenshotsDir}/`);

  const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NYAYAVAULT — Project Explanation & Screenshots</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    @page {
      size: A4;
      margin: 18mm 15mm 18mm 15mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #0b0f19;
      color: #f1f5f9;
      line-height: 1.6;
      font-size: 13px;
      margin: 0;
      padding: 0;
    }

    /* Headings */
    h1 {
      font-size: 26px;
      font-weight: 800;
      color: #3b82f6;
      border-bottom: 2px solid #1e293b;
      padding-bottom: 10px;
      margin-top: 0;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }

    h2 {
      font-size: 18px;
      font-weight: 700;
      color: #60a5fa;
      margin-top: 28px;
      margin-bottom: 12px;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 6px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 15px;
      font-weight: 700;
      color: #93c5fd;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    h4 {
      font-size: 13px;
      font-weight: 600;
      color: #cbd5e1;
      margin-top: 12px;
      margin-bottom: 6px;
    }

    p, li {
      color: #cbd5e1;
      font-size: 12.5px;
    }

    blockquote {
      background: #1e293b;
      border-left: 4px solid #3b82f6;
      margin: 12px 0;
      padding: 10px 14px;
      border-radius: 6px;
      color: #94a3b8;
      font-size: 12px;
    }

    /* Images & Figures */
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      border: 1px solid #334155;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      margin: 12px 0 18px 0;
      display: block;
      page-break-inside: avoid;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12px;
      page-break-inside: avoid;
    }

    th {
      background-color: #1e293b;
      color: #60a5fa;
      text-align: left;
      padding: 8px 12px;
      font-weight: 700;
      border: 1px solid #334155;
    }

    td {
      padding: 8px 12px;
      border: 1px solid #334155;
      color: #cbd5e1;
      background-color: #0f172a;
    }

    /* Code blocks & tags */
    code {
      font-family: 'JetBrains Mono', monospace;
      background-color: #1e293b;
      color: #38bdf8;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11.5px;
    }

    pre {
      background-color: #0f172a;
      border: 1px solid #334155;
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
    }

    pre code {
      background: none;
      padding: 0;
      color: #e2e8f0;
    }

    hr {
      border: none;
      border-top: 1px solid #1e293b;
      margin: 24px 0;
    }

    ul, ol {
      padding-left: 20px;
    }

    li {
      margin-bottom: 4px;
    }

    /* Page Breaks for clean layout */
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <div class="content">
    ${htmlContent}
  </div>
</body>
</html>
  `;

  const tmpHtmlPath = path.join(__dirname, 'pdf_template.html');
  fs.writeFileSync(tmpHtmlPath, fullHTML, 'utf-8');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Loading HTML template into Playwright Chromium...');
  await page.goto(`file:///${tmpHtmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });

  const pdfPath = path.join(__dirname, 'NYAYAVAULT_Project_Explanation.pdf');
  console.log(`Generating PDF artifact at: ${pdfPath}...`);

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '15mm',
      right: '15mm',
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: Arial; font-size: 8px; color: #64748b; width: 100%; text-align: right; padding-right: 15mm;">
        NYAYAVAULT — SIH Problem Statement SIH26190 | Official Prototype Documentation
      </div>
    `,
    footerTemplate: `
      <div style="font-family: Arial; font-size: 8px; color: #64748b; width: 100%; text-align: center;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span> — Confidential Legal Technology Prototype
      </div>
    `,
  });

  await browser.close();
  fs.unlinkSync(tmpHtmlPath);

  console.log(`✓ PDF Generated Successfully: ${pdfPath}`);

  // Also copy to artifacts brain folder
  const brainDir = 'C:\\Users\\yashw\\.gemini\\antigravity-ide\\brain\\5f645117-2a23-4382-a12f-ed32d0b4cc6c';
  const brainPdfPath = path.join(brainDir, 'NYAYAVAULT_Project_Explanation.pdf');
  if (fs.existsSync(brainDir)) {
    fs.copyFileSync(pdfPath, brainPdfPath);
    console.log(`✓ Copied PDF artifact to brain directory: ${brainPdfPath}`);
  }
}

buildPDF();
