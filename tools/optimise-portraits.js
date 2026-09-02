import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const OUT_DIR = path.join(root, "src", "assets", "images");

// Both portraits are cut-outs with real transparency, so they have to
// keep an alpha channel — WebP holds it at roughly a quarter of the
// size of an equivalent PNG.
const PORTRAITS = [
  { src: "assets/images/portraits/Founder.png", out: "founder.webp" },
  { src: "assets/images/portraits/CEO.png", out: "ceo.webp" },
];

const TARGET_WIDTH = 900;

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const { src, out } of PORTRAITS) {
  const srcPath = path.join(root, src);
  const outPath = path.join(OUT_DIR, out);

  await sharp(srcPath)
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(outPath);

  const { size } = fs.statSync(outPath);
  console.log(`${src} -> src/assets/images/${out}  ${(size / 1024).toFixed(0)}KB`);
}
