# Audarma Demo

Live demonstration of [Audarma](https://github.com/audarma/audarma) - LLM-powered translation system for React/Next.js.

## What This Demo Shows

- Real-time translation of Hacker News stories
- Smart caching with localStorage (instant when switching back)
- Global usage statistics across all users
- Automatic model fallback on rate limits (Qwen3-32B → Qwen3-235B)
- Support for 6 languages: English, Spanish, French, German, Russian, Japanese

## Tech Stack

- Next.js 16 with App Router
- Audarma translation library
- Cerebras Qwen3 models (blazing fast LLM inference)
- Cloudflare KV for global stats storage
- next-intl for locale routing
- Tailwind CSS for styling

## Local Development

1. Clone and install:

```bash
git clone https://github.com/audarma/audarma.github.io.git
cd audarma.github.io
npm install
```

2. Create `.env.local`:

```bash
CEREBRAS_API_KEY=your_key_here
```

Get your free Cerebras API key at https://cloud.cerebras.ai

3. Run development server:

```bash
npm run dev
```

Open http://localhost:3000/en

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel dashboard
3. Enable Vercel KV in Storage tab
4. Add `CEREBRAS_API_KEY` environment variable
5. Deploy

Vercel will automatically configure KV environment variables.

## How It Works

1. Fetches top 8 stories from Hacker News API
2. User selects language from dropdown
3. Audarma translates titles and summaries using Cerebras Qwen3
4. Translations cached in localStorage (instant on revisit)
5. Global stats tracked in Vercel KV (all users combined)
6. Automatic model fallback if rate limited

## Architecture

- `/app/[locale]/page.tsx` - Main demo page with AudarProvider
- `/app/api/translate/route.ts` - Translation endpoint with model fallback
- `/app/api/stats/route.ts` - Global statistics endpoint
- `/lib/cerebras-provider.ts` - LLM provider with fallback logic
- `/lib/localstorage-adapter.ts` - Database adapter for caching
- `/lib/hackernews.ts` - HN API fetcher

## Links

- Main library: https://github.com/audarma/audarma
- npm package: https://www.npmjs.com/package/audarma
- Live demo: https://audarma.github.io
