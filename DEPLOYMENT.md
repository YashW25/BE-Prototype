# Vercel Deployment Guide for NYAYAVAULT

NYAYAVAULT Prototype 1 is architected specifically for serverless deployment on Vercel.

---

## Prerequisites

- GitHub / GitLab account
- Vercel account ([vercel.com](https://vercel.com))
- Supabase Project credentials (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## Deployment Steps

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial release of NYAYAVAULT Prototype 1"
git branch -M main
git remote add origin https://github.com/your-username/nyayavault.git
git push -u origin main
```

---

### Step 2: Import Project in Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Select your `nyayavault` repository.
4. Framework Preset: **Next.js**.
5. Root Directory: `./`.

---

### Step 3: Configure Environment Variables in Vercel

Under **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-supabase-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-supabase-anon-key` |

---

### Step 4: Deploy

Click **Deploy**. Vercel will build Next.js App Router routes and deploy your live URL.
