import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// The original PNGs live outside the repo now (moved to reduce repo size —
// see Frufresh-original-assets/), so this points there instead of ./assets.
const SRC_DIR = path.join(root, "..", "Frufresh-original-assets", "assets", "images", "frames", "hero");
const OUT_DIR = path.join(root, "src", "assets", "frames", "hero");
const TARGET_WIDTH = 1920;
// Was 100 — full-fidelity JPEGs came out to ~1.5MB each (184 frames scrubbed
// on scroll), which is what made the hero laggy. The products page's frame
// sequences use quality 82 and scroll smoothly, so matching that here.
const JPEG_QUALITY = 82;

fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs
  .readdirSync(SRC_DIR)
  .filter((f) => /^frame_\d+\.png$/i.test(f))
  .sort();

console.log(`Converting ${files.length} frames -> ${OUT_DIR}`);

let done = 0;
for (const file of files) {
  const srcPath = path.join(SRC_DIR, file);
  const outName = file.replace(/\.png$/i, ".jpg");
  const outPath = path.join(OUT_DIR, outName);

  await sharp(srcPath)
    .resize({ width: TARGET_WIDTH })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(outPath);

  done++;
  if (done % 25 === 0 || done === files.length) {
    console.log(`  ${done}/${files.length}`);
  }
}

const manifest = {
  count: files.length,
  prefix: "assets/frames/hero/frame_",
  digits: files.length ? files[0].match(/\d+/)[0].length : 4,
  ext: "jpg",
};
fs.writeFileSync(
  path.join(root, "src", "config", "manifest.json"),
  JSON.stringify(manifest, null, 2)
);

console.log("Done.", manifest);
