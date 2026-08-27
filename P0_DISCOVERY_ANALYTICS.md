# P0: discovery, canonical URL, and analytics

This file records the infrastructure behind the public profile so the setup is reproducible.

## Current status

Implemented and verified in source control:

- recoverable backup of the legacy GitHub Pages site
- canonical hostname `gbibbo.github.io`
- automatic sitemap generation
- `robots.txt`
- preserved Google Search Console verification file
- GitHub Pages deployment workflow
- Cloudflare Pages backend with versioned Workers AI and D1 bindings
- anonymous bot-question logging to D1
- bot endpoint CORS for the future GitHub Pages frontend
- Cloudflare Web Analytics loader scoped to the canonical public hostname

Still to activate externally:

1. Deploy V2 to `master` only after the remaining production checks.
2. Verify the new production site and submit `https://gbibbo.github.io/sitemap.xml` in Google Search Console.

## Safety backup

The legacy GitHub Pages site was frozen before changing the canonical URL:

- Branch: `backup/pre-site-v2-2026-08-27`
- Commit: `89fdac6b4eadb75b1a3f5bd4f7c67e74993da6a9`

Restoring that branch to `master` restores the pre-V2 site state.

## Canonical public URL

The canonical profile URL is:

`https://gbibbo.github.io/`

The Astro site config, profile data, canonical tags, CV links, sitemap, and robots file use this hostname.

## Google Search Console

The previous verification file is preserved in the generated site:

`/google7901b35217a9c314.html`

After deployment, verify that this URL returns the verification text, then submit:

`https://gbibbo.github.io/sitemap.xml`

The sitemap is generated automatically from built pages and currently contains:

- `/`
- `/es/`
- `/cv/`
- `/es/cv/`

## GitHub Pages deployment

`.github/workflows/deploy-github-pages.yml` builds Astro and deploys `dist/` when `master` changes.

GitHub repository Settings > Pages is configured to use GitHub Actions as the build source.

## Cloudflare Web Analytics

Cloudflare Web Analytics site:

`gbibbo.github.io`

Beacon token:

`3be599b0fe114d2c8821c689fbb50d80`

The beacon token is public by design and is versioned in `scripts/inject-cloudflare-analytics.mjs`.

The build injects a small loader into generated site pages. The loader only downloads Cloudflare's analytics beacon when `location.hostname === 'gbibbo.github.io'`, so Cloudflare preview deployments and localhost testing do not contaminate production visitor metrics.

Google verification HTML without a `</body>` is deliberately left untouched.

## Profile assistant backend

The public frontend on `gbibbo.github.io` calls:

`https://gbibbo-site.pages.dev/api/chat`

Cloudflare previews continue using their local `/api/chat` endpoint.

`functions/api/chat.ts` explicitly allows CORS from:

- `https://gbibbo.github.io`
- `https://gbibbo-site.pages.dev`
- Cloudflare Pages preview subdomains
- localhost for development

The assistant uses a higher-quality free-tier-first model cascade and explicitly preserves conversational context for short follow-up turns.

## Anonymous bot-question analytics with D1

Active D1 database:

`profile-analytics`

Binding:

`ANALYTICS_DB`

The Workers AI binding is:

`AI`

Both bindings are versioned in `wrangler.jsonc`, including the D1 database ID, so Preview and Production do not depend on manually duplicated dashboard configuration.

Schema:

`cloudflare/d1-schema.sql`

The bot records only:

- anonymous session ID scoped to the browser session
- language
- page path
- question
- answer
- response source
- Workers AI model
- success/failure
- latency
- model error text when relevant

It deliberately does not store IP addresses or user-agent strings.

The assistant UI discloses that questions may be stored anonymously.

### Useful D1 queries

Recent questions:

```sql
SELECT created_at, language, question, answer, model, latency_ms
FROM bot_questions
ORDER BY created_at DESC
LIMIT 100;
```

Most common questions, approximately:

```sql
SELECT lower(trim(question)) AS question, COUNT(*) AS n
FROM bot_questions
GROUP BY lower(trim(question))
ORDER BY n DESC
LIMIT 50;
```

Workers AI reliability:

```sql
SELECT source, success, COUNT(*) AS n, ROUND(AVG(latency_ms), 0) AS avg_latency_ms
FROM bot_questions
GROUP BY source, success
ORDER BY n DESC;
```

Questions by day:

```sql
SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS questions
FROM bot_questions
GROUP BY day
ORDER BY day DESC;
```

## Health check

`GET https://gbibbo-site.pages.dev/api/chat` reports:

- whether the `AI` binding exists
- whether the `ANALYTICS_DB` binding exists
- configured Workers AI model candidates

This endpoint does not expose stored questions.
