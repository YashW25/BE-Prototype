# NYAYAVAULT — Secure Digital Document Management System

> **SIH Problem Statement**: SIH26190 — Software Edition  
> **Sponsoring Organization**: Ministry of Home Affairs / National Crime Records Bureau (NCRB)  
> **Prototype Version**: Prototype 1.0  
> **Environment Status**: Demonstration / Prototype Environment  

NYAYAVAULT is a secure digital document management system designed for law-enforcement, legal, forensic, and judicial investigation workflows. It provides case-centric document organization, role-based access control (RBAC), cryptographic SHA-256 integrity verification, mock blockchain ledger abstraction, simulated FIR import, and centralized security audit logging.

---

## 🚀 Key Features in Prototype 1

1. **Authentication & Session Persistence**: Supabase Auth integration with local demo role preset support.
2. **Role-Based Access Control (RBAC)**: Role dashboards and route protection for `ADMIN`, `INVESTIGATOR`, `LEGAL`, `FORENSIC`, and `COURT` officers.
3. **Simulated Police Station FIR Integration**: Async FIR retrieval simulation (`FIR/2026/01842`) yielding automated case creation.
4. **Cryptographic SHA-256 Hashing**: Live browser-side Web Crypto API hashing before document upload.
5. **Supabase Cloud Storage & PostgreSQL**: Secure bucket uploads under structured paths (`cases/{case_id}/{document_id}/{filename}`).
6. **Mock Blockchain Ledger Abstraction**: `BlockchainService` registering deterministic proof transactions (`TX-2026-XXXXXX`) in `integrity_records`.
7. **Document Integrity Verification**: Interactive verification page comparing current file hash against ledger records with SUCCESS / TAMPER MISMATCH alerts.
8. **Immutable Audit Trail**: Structured event logging (`LOGIN`, `FIR_IMPORTED`, `CASE_CREATED`, `DOCUMENT_UPLOADED`, `HASH_GENERATED`, `INTEGRITY_RECORDED`, `DOCUMENT_VERIFIED`).

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & Vanilla CSS Design System
- **Icons**: Lucide Icons (`lucide-react`)
- **Backend & Database**: Supabase PostgreSQL & Supabase Storage
- **Authentication**: Supabase Auth (`@supabase/ssr` & `@supabase/supabase-js`)
- **Cryptography**: Web Crypto API (`crypto.subtle`)
- **Deployment**: Vercel Serverless Ready

---

## 🔑 Demo Role Accounts

For instant testing, use the preset accounts provided on the `/login` page:

| Role | Demo Email | Target Workspace |
| :--- | :--- | :--- |
| **Investigator** | `investigator@nyayavault.demo` | `/investigator` |
| **Legal Prosecutor** | `legal@nyayavault.demo` | `/legal` |
| **Forensic Officer** | `forensic@nyayavault.demo` | `/forensic` |
| **Judicial Registrar** | `court@nyayavault.demo` | `/court` |
| **System Admin** | `admin@nyayavault.demo` | `/admin` |

---

## 🏃 Quick Start (Local Development)

```bash
# 1. Clone & install dependencies
npm install

# 2. Configure environment variables (optional for live Supabase backend)
cp .env.example .env.local

# 3. Launch development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📜 Full End-to-End Demo Workflow

1. Open application -> Click **"LOGIN TO SYSTEM"**.
2. Select **`investigator@nyayavault.demo`** -> Click **"AUTHENTICATE SESSION"**.
3. Redirects to **`/investigator`** dashboard.
4. Click **"IMPORT FIR RECORD"** in top bar or sidebar.
5. Enter FIR Reference **`FIR/2026/01842`** -> Click **"FETCH FIR RECORD"**.
6. Observe simulated integration handshake -> Click **"IMPORT INTO NYAYAVAULT CASE REGISTRY"**.
7. Automatically redirects to **Case Details** (`/cases/case-...`).
8. Click **"UPLOAD CASE DOCUMENT"** -> Select a test PDF or image file.
9. Watch live SHA-256 hash computation -> Click **"Upload & Commit SHA-256 to Ledger"**.
10. Click **"Verify Cryptographic Hash"** on the document card.
11. Observe **"DOCUMENT VERIFIED — ✓ SHA-256 MATCH"** status banner.
12. Test **"Simulate 1-Bit File Alteration"** to verify tamper detection.
13. Open **"System Audit Trail"** (`/audit`) to view recorded event telemetry.

---

## 📁 Documentation Links

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) — Database schema, migration, RLS policies, and storage setup.
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Step-by-step Vercel deployment guide.
