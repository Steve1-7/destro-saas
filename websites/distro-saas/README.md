# Distro — Content Distribution Dashboard

A developer-first SaaS for distributing content across YouTube, TikTok, LinkedIn, and Facebook — with AI-powered caption adaptation, real-time status tracking, and a dark-mode neural UI.

---

## Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js 14 (App Router)             |
| Database   | Supabase (PostgreSQL + Realtime)    |
| Auth       | Supabase Auth (Magic Link)          |
| Storage    | Supabase Storage                    |
| AI         | Anthropic Claude (claude-sonnet-4)  |
| Styling    | Tailwind CSS + Custom CSS Variables |
| Icons      | Lucide React                        |
| UI         | shadcn/ui primitives (Radix)        |

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-org/distro-saas
cd distro-saas
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` for server-side admin operations
- `ANTHROPIC_API_KEY` for AI caption generation
- OAuth credentials for each platform (see Platform Setup below)

### 3. Run Supabase migrations

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

Or run the SQL files manually in your Supabase SQL editor:
```
supabase/migrations/001_posts.sql
supabase/migrations/002_integrations.sql
supabase/migrations/003_distributions.sql
```

### 4. Create Supabase Storage bucket

In your Supabase dashboard → Storage → New bucket:
- Name: `media`
- Public: `true` (for CDN delivery)

### 5. Run the app

```bash
npm run dev
# Open http://localhost:3000
```

---

## Platform OAuth Setup

### YouTube (Google)
1. Create a project at [Google Cloud Console](https://console.cloud.google.com)
2. Enable **YouTube Data API v3**
3. Create OAuth 2.0 credentials (Web application)
4. Add redirect URI: `http://localhost:3000/api/integrations/oauth/youtube`

### TikTok
1. Register at [TikTok for Developers](https://developers.tiktok.com)
2. Create an app and request **Content Posting API** access
3. Add redirect URI: `http://localhost:3000/api/integrations/oauth/tiktok`

### LinkedIn
1. Create an app at [LinkedIn Developer Portal](https://developer.linkedin.com)
2. Request `w_member_social` scope
3. Add redirect URI: `http://localhost:3000/api/integrations/oauth/linkedin`

### Facebook
1. Create an app at [Meta for Developers](https://developers.facebook.com)
2. Add `pages_manage_posts` and `pages_read_engagement` permissions
3. Add redirect URI: `http://localhost:3000/api/integrations/oauth/facebook`

---

## Architecture

```
User uploads media
    → /api/upload/presigned         (get Supabase Storage URL)
    → Direct upload to Supabase Storage

User clicks "Publish All"
    → POST /api/publish/youtube     (3 retries, exponential backoff)
    → POST /api/publish/tiktok
    → POST /api/publish/linkedin
    → POST /api/publish/facebook

Real-time progress
    → GET /api/status/[postId]      (Server-Sent Events via Supabase Realtime)
    → Updates distributions table
    → UI polls via useDistributionStatus hook
```

### Retry Logic

Each publish handler attempts up to **3 retries** with exponential backoff:
- Attempt 1: immediate
- Attempt 2: 1 second delay
- Attempt 3: 3 second delay
- Fail after attempt 3: mark as `failed`, expose Retry button

### AI Caption Adaptation

`/api/ai/adapt-caption` calls `claude-sonnet-4-20250514` with platform-specific prompts:
- **LinkedIn**: Professional, insight-driven, thought leadership tone
- **TikTok**: Hook-heavy, Gen-Z friendly, trending hashtags
- **YouTube**: SEO keywords, timestamps, subscribe CTA
- **Facebook**: Casual, community-friendly, open-ended question

---

## Database Schema

### `posts`
Stores master content with per-platform caption variants and lifecycle status.

### `integrations`
Stores OAuth tokens (access + refresh), platform identity, and per-platform settings.

### `distributions`
Tracks per-platform publish state, progress (0–100), external post ID/URL, and retry count.
Realtime-enabled for SSE streaming.

---

## License

MIT
