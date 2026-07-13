# Cloudflare Pages deployment

This repo now contains a new Astro one-page portfolio implementation while preserving the existing root `index.html` and assets.

## Recommended Cloudflare Pages settings

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node.js version: current LTS

## Current deployment check

- Production branch must be `master`.
- The site should be built from `src/` with Astro and published from `dist`.
- Manual redeploy trigger: 2026-06-18 Spanish localization deployment check.
- Manual redeploy trigger: 2026-06-18 after clearing Cloudflare build watch paths.
- Manual redeploy trigger: 2026-07-12 Edge Audio Labs profile update and profile-photo favicon.
- Manual redeploy trigger: 2026-07-12 remove TU Delft and add supplied Edge Audio Labs artwork.
- Manual redeploy trigger: 2026-07-13 crop Edge Audio Labs artwork to experience-card dimensions.
- Manual redeploy trigger: 2026-07-13 replace Edge Audio Labs copy and company link.
- Manual redeploy trigger: 2026-07-13 official Google, KPMG and Ikatu logos, Edge bullet points, and education-logo hover feedback.
- Manual redeploy trigger: 2026-07-13 restore four rotating profile cards with three facts per card.

## Notes

- The current GitHub Pages site can keep serving the old root `index.html` until Cloudflare Pages is connected.
- The new implementation lives under `src/` and uses existing assets from `homepage_files/` and `media/`.
- The profile assistant uses Cloudflare Pages Functions and a Workers AI binding named `AI`.
