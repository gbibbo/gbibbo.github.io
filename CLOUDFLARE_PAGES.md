# Cloudflare Pages deployment

This repo now contains a new Astro one-page portfolio implementation while preserving the existing root `index.html` and assets.

## Recommended Cloudflare Pages settings

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node.js version: current LTS

## Notes

- The current GitHub Pages site can keep serving the old root `index.html` until Cloudflare Pages is connected.
- The new implementation lives under `src/` and uses existing assets from `homepage_files/` and `media/`.
- The first version intentionally ships without the profile assistant/chatbot. The structure can support Cloudflare Pages Functions later.
