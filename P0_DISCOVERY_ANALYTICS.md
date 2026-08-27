# P0: discovery, canonical URL, and analytics

This file records the infrastructure behind the public profile so the setup is reproducible.

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

The sitemap currently contains:

- `/`
- `/es/`
- `/cv/`
- `/es/cv/`

## GitHub Pages deployment

`.github/workflows/deploy-github-pages.yml` builds Astro and deploys `dist/` when `master` changes.

Before the first production deployment, GitHub repository Settings > Pages must use GitHub Actions as the build source.

## Cloudflare Web Analytics

The build can inject Cloudflare's privacy-oriented analytics beacon without cookies.

Create a Web Analytics site for `gbibbo.github.io` in Cloudflare and copy its beacon token.

In GitHub, create the repository Actions variable:

`CLOUDFLARE_WEB_ANALYTICS_TOKEN`

The deployment workflow exposes it to the Astro build as:

`PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN`

`scripts/inject-cloudflare-analytics.mjs` injects the beacon into every generated HTML file only when that variable is present.

## Profile assistant backend

The public frontend on `gbibbo.github.io` calls:

`https://gbibbo-site.pages.dev/api/chat`

Cloudflare previews continue using their local `/api/chat` endpoint.

`functions/api/chat.ts` explicitly allows CORS from:

- `https://gbibbo.github.io`
- `https://gbibbo-site.pages.dev`
- Cloudflare Pages preview subdomains
- localhost for development

## Anonymous bot-question analytics with D1

Create a Cloudflare D1 database, for example:

`gabriel-profile-analytics`

Bind it to the Pages project with the variable name:

`ANALYTICS_DB`

Apply the schema in:

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
