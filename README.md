# Astro Project for Vercel Deployment

A minimal Astro project with a single page containing only an image.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your image:
   - Place your image file as `public/image.jpg`
   - Or update the `src` in `src/pages/index.astro` to point to your image

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this project to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the repository in Vercel
3. Vercel will automatically detect the Astro framework and deploy

Or use Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Project Structure

- `src/pages/index.astro` - The single page with an image
- `public/` - Static assets (place your image here)
- `astro.config.mjs` - Configured for Vercel static deployment
