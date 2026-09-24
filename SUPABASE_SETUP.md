# Supabase Setup Guide for NYAYAVAULT

Follow these steps to link your Supabase project to NYAYAVAULT.

---

## 1. Create Supabase Project

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project** -> Enter Project Name `NYAYAVAULT` and set database password.
3. Select your region and click **Create New Project**.

---

## 2. Execute Migration SQL

1. In Supabase Dashboard, go to **SQL Editor**.
2. Click **New Query**.
3. Copy the contents of [`supabase/migrations/20260924_initial_schema.sql`](./supabase/migrations/20260924_initial_schema.sql) and paste into the query editor.
4. Click **Run**.
5. Create a second query, copy contents of [`supabase/seed.sql`](./supabase/seed.sql), and click **Run**.

---

## 3. Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**.
2. Click **New Bucket**.
3. Bucket Name: `documents`.
4. Toggle **Public Bucket**: `ON` (or configure authenticated access policies).
5. Click **Save**.

---

## 4. Retrieve Credentials & Environment Variables

1. Go to **Project Settings** -> **API**.
2. Copy:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

3. Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## 5. Provision Demo Auth Users (Optional)

In Supabase Dashboard under **Authentication** -> **Users**, click **Add User** -> **Create User**:

- `investigator@nyayavault.demo`
- `legal@nyayavault.demo`
- `forensic@nyayavault.demo`
- `court@nyayavault.demo`
- `admin@nyayavault.demo`
