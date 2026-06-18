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

## Notes

- The current GitHub Pages site can keep serving the old root `index.html` until Cloudflare Pages is connected.
- The new implementation lives under `src/` and uses existing assets from `homepage_files/` and `media/`.
- The profile assistant uses Cloudflare Pages Functions and a Workers AI binding named `AI`.
