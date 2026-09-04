# Frufresh

Two pages served by one small static server:

- **Home** — a canvas scroll-scrubbed frame sequence, then the founder/CEO story.
  Vanilla HTML/CSS/JS, served straight out of `src/`.
- **Products** — a React + Vite app for the apple and orange cultivars.
  It lives *inside* the main app at `src/products/` and is mounted at `/products/`.

## Run it

```
npm run dev            # http://localhost:5173
```

The products page is a build artifact, so rebuild it after changing anything
under `src/products/src`:

```
npm run build:products
```

## Layout

```
assets/                        original master media — build inputs, never served
  images/logo/                   logo.png (master)
  images/portraits/              CEO.png, Founder.png (masters)
  images/frames/hero/            184 source PNG frames for the home sequence
  video/                         hero-video.mp4, loading.mp4

src/                           the site's web root
  index.html                     home page document
  styles/style.css               home page styles
  scripts/script.js              scroll engine, grain dissolve, guide grid, logo handoff
  config/manifest.json           frame count/prefix/extension, read at runtime
  assets/
    images/                      logo.png, founder.webp, ceo.webp        -> /assets/images/...
    video/                       hero-video.mp4, loading.mp4             -> /assets/video/...
    frames/hero/                 143 optimised WebP frames               -> /assets/frames/hero/...

  products/                    the products app, contained in the main project
    index.html                   Vite entry document
    vite.config.ts, tsconfig.json, package.json
    src/
      main.tsx, App.tsx
      components/                UI components
      pages/                     page-level components
      data/                      fruit specimen data
      types/                     shared TypeScript types
      styles/                    index.css (Tailwind + component styles)
    assets/                                                              -> /products-assets/...
      images/frames/             source PNG sequences (apple, orange)
      images/frames-optimised/   compressed JPEG stand-ins actually served
      video/                     apple-loop.mp4, oranges-loop.mp4
    public/                      Vite publicDir, mirrors the same URL namespace
    dist/                        build output, mounted at /products/

server/index.js                static server: byte-range media, /products mounts
tools/                         one-off asset pipeline scripts (sharp)
```

### URL namespaces

The two apps keep separate media prefixes so they never collide:

| prefix              | serves from                  |
| ------------------- | ---------------------------- |
| `/`                 | `src/`                       |
| `/assets/…`         | `src/assets/` (home media)   |
| `/products/…`       | `src/products/dist/`         |
| `/products-assets/…`| `src/products/assets/`       |

`/products-assets/images/frames/<fruit>/frame_NNN.png` is transparently answered
with the matching JPEG from `images/frames-optimised/`, so the app can keep asking
for the PNG while the wire only ever carries the light file.

## Asset pipeline

| script                          | in                              | out                            |
| ------------------------------- | ------------------------------- | ------------------------------ |
| `npm run convert-frames`        | `assets/images/frames/hero/`    | `src/assets/frames/hero/` + manifest |
| `npm run optimise-portraits`    | `assets/images/portraits/`      | `src/assets/images/*.webp`     |
| `npm run optimise-product-frames` | `src/products/assets/images/frames/` | `…/frames-optimised/`     |
| `npm run trim-logo`             | `assets/images/logo/logo.png`   | `src/assets/images/logo.png`   |
| `npm run check-frames`          | `assets/images/frames/hero/`    | continuity report              |
