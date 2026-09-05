import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The products sequences shipped as full-size PNGs — 428KB a frame for
// apple, 1.3MB for orange. A 1.3MB PNG takes ~18ms to decode, and the
// whole frame budget at 60fps is 16.7ms, so every new frame dropped one.
//
// This re-encodes them as JPEG *in place*, so there is still one frames/
// folder with one file per frame and nothing else to keep in sync. The
// PNGs are moved out to Frufresh-original-assets/ rather than deleted.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SRC = path.join(root, "src", "products", "assets", "images", "frames");
const BACKUP = path.join(root, "..", "Frufresh-original-assets", "product-frames");

const SEQUENCES = ["apple", "orange", "dragonfruit"];
const QUALITY = 90;

const mb = (n) => (n / 1048576).toFixed(1) + "MB";

for (const seq of SEQUENCES) {
  const dir = path.join(SRC, seq);
  const bak = path.join(BACKUP, seq);

  if (!fs.existsSync(dir)) {
    console.log(`missing sequence: ${dir}`);
    continue;
  }
  fs.mkdirSync(bak, { recursive: true });

  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.png$/i.test(f))
    .sort();

  if (!files.length) {
    console.log(`${seq}: already converted, nothing to do`);
    continue;
  }

  let before = 0;
  let after = 0;

  for (const file of files) {
    const from = path.join(dir, file);
    // Same stem, same folder — only the extension changes.
    const to = path.join(dir, file.replace(/\.png$/i, ".jpg"));

    await sharp(from).jpeg({ quality: QUALITY, mozjpeg: true }).toFile(to);

    before += fs.statSync(from).size;
    after += fs.statSync(to).size;

    fs.renameSync(from, path.join(bak, file));
  }

  console.log(
    `${seq}: ${files.length} frames  ${mb(before)} -> ${mb(after)}` +
      `  (avg ${Math.round(after / files.length / 1024)}KB per frame)`
  );
}

console.log(`Originals moved to ${BACKUP}`);
