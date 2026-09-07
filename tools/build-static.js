import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Assembles dist/ — a plain static mirror of what server/index.js serves
// at request time. Netlify (and any other static host) has no Node process
// to do those mounts, so the URL structure has to exist as real folders:
//
//   server/index.js mount          ->  dist/ path
//   /                 src/            /
//   /assets/...       src/assets/     /assets/...
//   /products/...     product build   /products/...
//   /products-assets  src/assets/     /products-assets/...
//                       product-page/
//
// Run after `vite build`, which produces the /products bundle.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SRC = path.join(root, "src");
const OUT = path.join(root, "dist");
const PRODUCT_BUILD = path.join(SRC, "product-page", "dist");
const PRODUCT_ASSETS = path.join(SRC, "assets", "product-page");

function copyDir(from, to, { skip = () => false } = {}) {
  if (!fs.existsSync(from)) return 0;
  fs.mkdirSync(to, { recursive: true });

  let files = 0;
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    if (skip(src)) continue;

    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      files += copyDir(src, dest, { skip });
    } else {
      fs.copyFileSync(src, dest);
      files++;
    }
  }
  return files;
}

const mb = (n) => (n / 1048576).toFixed(1) + "MB";

function dirSize(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    total += entry.isDirectory() ? dirSize(p) : fs.statSync(p).size;
  }
  return total;
}

if (!fs.existsSync(PRODUCT_BUILD)) {
  console.error(
    `Missing ${path.relative(root, PRODUCT_BUILD)} — run \`npm run build:products\` first.`
  );
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let count = 0;

// The home page, its styles/scripts/config. Everything at the top of src/
// except the two folders that get remapped below.
for (const name of ["index.html", "styles", "scripts", "config"]) {
  const from = path.join(SRC, name);
  if (!fs.existsSync(from)) continue;
  if (fs.statSync(from).isDirectory()) {
    count += copyDir(from, path.join(OUT, name));
  } else {
    fs.copyFileSync(from, path.join(OUT, name));
    count++;
  }
}

// Home-page media. The products app's media lives under here too, but it
// is served from its own /products-assets prefix — copying it in both
// places would ship ~48MB twice.
count += copyDir(path.join(SRC, "assets"), path.join(OUT, "assets"), {
  skip: (p) => path.resolve(p) === path.resolve(PRODUCT_ASSETS),
});

count += copyDir(PRODUCT_ASSETS, path.join(OUT, "products-assets"));
count += copyDir(PRODUCT_BUILD, path.join(OUT, "products"));

console.log(`dist/ assembled — ${count} files, ${mb(dirSize(OUT))}`);
for (const p of ["assets", "products", "products-assets"]) {
  console.log(`  /${p.padEnd(16)} ${mb(dirSize(path.join(OUT, p)))}`);
}
