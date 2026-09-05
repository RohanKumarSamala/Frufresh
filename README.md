# Frufresh

Two pages, one project, one dev server:

- **Home** — a canvas scroll-scrubbed frame sequence, then the founder/CEO story.
  Vanilla HTML/CSS/JS, served straight out of `src/`.
- **Products** — a React + Vite app for the apple, orange, and dragonfruit cultivars.
  It lives at `src/product-page/` and is mounted at `/products/`.

Both used to need their own `npm install` and their own `npm run dev` (the
products app was a separate nested npm project at `src/products/`). That's
gone now — one dependency tree, one dev server, one command.

## Run it

```
npm install
npm run dev             # http://localhost:5173
```

`server/index.js` runs Vite in middleware mode inside the same process, so
editing anything under `src/product-page/` hot-reloads at `/products/` exactly
like editing `src/index.html` reloads the home page — no separate server, no
rebuild step needed while developing.

`npm run build:products` still exists if you ever want a prebuilt static
bundle of the products app (e.g. for a host that can't run this Node server),
but it is optional — dev doesn't depend on it.

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
    images/                      logo.png, founder.png, ceo.png            -> /assets/images/...
    video/                       hero-video.mp4, loading.mp4               -> /assets/video/...
    frames/hero/                 143 optimised WebP frames                 -> /assets/frames/hero/...
    product-page/                the products app's own media (see below)  -> /products-assets/...

  product-page/                the products app's source
    index.html                    Vite entry document
    tsconfig.json
    src/
      main.tsx, App.tsx
      components/                UI components
      pages/                     page-level components
      data/                      fruit specimen data
      types/                     shared TypeScript types
      styles/                    index.css (Tailwind + component styles)
    dist/                        optional prebuilt bundle from `npm run build:products` (gitignored)

vite.config.ts                 config for the products app (root src/product-page, base /products/)
server/index.js                one server: byte-range media for the home page,
                                Vite middleware mode for /products, and the
                                /products-assets mount below
tools/                         one-off asset pipeline scripts (sharp)
```

### URL namespaces

The two pages keep separate media prefixes so they never collide:

| prefix              | serves from                        |
| ------------------- | ----------------------------------- |
| `/`                 | `src/`                              |
| `/assets/…`         | `src/assets/` (home media)          |
| `/products/…`       | `src/product-page/` (live via Vite) |
| `/products-assets/…`| `src/assets/product-page/`          |

## Asset pipeline

| script                          | in                              | out                            |
| ------------------------------- | -------------------------------- | ------------------------------ |
| `npm run convert-frames`        | `assets/images/frames/hero/`     | `src/assets/frames/hero/` + manifest |
| `npm run optimise-portraits`    | `assets/images/portraits/`       | `src/assets/images/*.webp`     |
| `npm run optimise-product-frames` | `src/assets/product-page/images/frames/` | `…/frames-optimised/`   |
| `npm run trim-logo`             | `assets/images/logo/logo.png`    | `src/assets/images/logo.png`   |
| `npm run check-frames`          | `assets/images/frames/hero/`     | continuity report              |
| `npm run lint:products`         | `src/product-page/`               | TypeScript type-check           |
