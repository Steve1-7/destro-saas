Deploying environment variables to Vercel
======================================

This file shows quick, safe ways to set production environment variables for this project on Vercel.

1) Recommended: use the Vercel Dashboard (UI)

- Go to your Vercel project → Settings → Environment Variables
- Add each variable from `.env.local.example` and set the Environment to `Production`.
- For `NEXTAUTH_URL` set the value to your production URL, e.g. `https://your-project.vercel.app` or your custom domain.

2) Using the Vercel CLI (interactive)

- Install & login if needed:

```powershell
npm i -g vercel
vercel login
```

- From the repo root, run the following PowerShell snippet. It will call `vercel env add` for each key and prompt you to paste the value for production:

```powershell
$keys = @(
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
  'YOUTUBE_CLIENT_ID',
  'YOUTUBE_CLIENT_SECRET',
  'TIKTOK_CLIENT_KEY',
  'TIKTOK_CLIENT_SECRET',
  'LINKEDIN_CLIENT_ID',
  'LINKEDIN_CLIENT_SECRET',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
)

foreach ($k in $keys) {
  Write-Host "Adding $k to Vercel (production). You'll be prompted to paste the value..."
  vercel env add $k production
}
```

Notes:
- `vercel env add <NAME> production` runs interactively and will prompt you for the variable value.
- For `NEXTAUTH_URL` use the final production URL (for example `https://my-app.vercel.app`), not `http://localhost:3000`.

3) Bulk import (alternate)

- If you prefer to paste all values at once, create a temporary file `env-prod.txt` with `KEY=VALUE` lines and use the Vercel dashboard's "Import" feature (Settings → Environment Variables → Import from file).

4) Verify

- After setting env vars, deploy or trigger a redeploy from the Vercel dashboard. Test auth and OAuth redirect flows to ensure `NEXTAUTH_URL` is correct.

Security reminder
- Never commit secrets to git. Use `.env.local` locally and Vercel's secure env var storage for production.

---
