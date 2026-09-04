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
const QUALITY = 82;

fs.mkdirSync(OUT_DIR, { recursive: true });

function updateManifest() {
  const outFiles = fs
    .readdirSync(OUT_DIR)
    .filter((f) => /^frame_\d+\.(webp|jpg|jpeg|png)$/i.test(f))
    .sort();

  if (!outFiles.length) {
    console.error(`No frames found in ${OUT_DIR}`);
    return null;
  }

  const ext = path.extname(outFiles[0]).replace(/^\./, "").toLowerCase();
  const digitsMatch = outFiles[0].match(/\d+/);

  const manifest = {
    count: outFiles.length,
    prefix: "assets/frames/hero/frame_",
    digits: digitsMatch ? digitsMatch[0].length : 4,
    ext,
  };

  fs.writeFileSync(
    path.join(root, "src", "config", "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("Done. Manifest updated:", manifest);
  return manifest;
}

if (fs.existsSync(SRC_DIR)) {
  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => /^frame_\d+\.(png|webp|jpg|jpeg)$/i.test(f))
    .sort();

  if (files.length > 0) {
    console.log(`Converting ${files.length} frames -> ${OUT_DIR}`);

    let done = 0;
    for (const file of files) {
      const srcPath = path.join(SRC_DIR, file);
      const outName = file.replace(/\.(png|jpg|jpeg)$/i, ".webp");
      const outPath = path.join(OUT_DIR, outName);

      await sharp(srcPath)
        .resize({ width: TARGET_WIDTH })
        .webp({ quality: QUALITY })
        .toFile(outPath);

      done++;
      if (done % 25 === 0 || done === files.length) {
        console.log(`  ${done}/${files.length}`);
      }
    }
  }
}

updateManifest();

