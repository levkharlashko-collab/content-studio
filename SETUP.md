# Content Studio — Setup Guide

This guide walks you through getting the app running on the internet in about 30–45 minutes. No coding required.

---

## Step 1 — Install Node.js (one-time)

1. Go to [nodejs.org](https://nodejs.org) and download the **LTS** version.
2. Run the installer and follow the prompts.
3. To verify it worked, open Terminal and type: `node --version` — you should see a version number.

---

## Step 2 — Create a Supabase project (your database)

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New project**, give it a name (e.g. `content-studio`), choose a region close to you, and set a strong database password. **Save this password** somewhere safe.
3. Wait ~2 minutes while Supabase sets up.
4. Go to **Project Settings → API** and copy these two values — you'll need them shortly:
   - **Project URL** (looks like `https://xxxxxxxx.supabase.co`)
   - **anon / public key** (long string starting with `eyJ`)
   - Also copy the **service_role** key (keep this secret — never share it)

5. Go to the **SQL Editor** (left sidebar), paste the entire contents of `supabase/migrations/0001_initial_schema.sql`, and click **Run**.

6. Go to **Authentication → Providers → Email** and make sure it is **enabled**.

---

## Step 3 — Get a Claude API key (for the AI assistant)

1. Go to [console.anthropic.com](https://console.anthropic.com) and create an account.
2. Go to **API Keys → Create Key**, name it `content-studio`, and copy the key. It starts with `sk-ant-`.
3. **Store it somewhere safe** — it's only shown once.

---

## Step 4 — Configure the app

1. In the `Project 1` folder, find the file called `.env.local.example`.
2. Make a copy of it and rename the copy to `.env.local`.
3. Open `.env.local` in any text editor and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-your-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 5 — Run the app locally (test it first)

1. Open **Terminal** and navigate to this project folder:
   ```
   cd ~/Desktop/Project\ 1
   ```
2. Install dependencies (first time only):
   ```
   npm install
   ```
3. Start the app:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
5. Create an account with your email and password.
6. Your 5 default stages (Idea → Research → Scripting → Review → Published) will appear automatically.

---

## Step 6 — Put it on the internet (Vercel deployment)

1. **Create a GitHub account** at [github.com](https://github.com) if you don't have one.
2. **Create a new repository** on GitHub named `content-studio` (set it to **Private**).
3. In Terminal, from the project folder, run:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/content-studio.git
   git push -u origin main
   ```
4. Go to [vercel.com](https://vercel.com) and sign up using your GitHub account.
5. Click **Add New Project → Import from GitHub** and select `content-studio`.
6. Before clicking Deploy, click **Environment Variables** and add these four:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key |
   | `ANTHROPIC_API_KEY` | Your Claude API key |

7. Click **Deploy**. In ~2 minutes, Vercel gives you a live URL like `https://content-studio-abc.vercel.app`.

8. Back in Supabase → **Authentication → URL Configuration**:
   - Set **Site URL** to your Vercel URL
   - Add `https://your-app.vercel.app/auth/callback` to **Redirect URLs**

---

## That's it!

Your app is now live. Every time you want to update the app, push new code to GitHub and Vercel redeploys automatically.

**Default stages:** Idea · Research · Scripting · Review · Published  
**Platforms:** Instagram · YouTube · TikTok  
**AI:** Click "Polish with AI" inside any card to open the assistant.
