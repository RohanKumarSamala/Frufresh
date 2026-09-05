import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The products app scrubs through full-size PNG frames — the orange
// sequence alone is 92MB, which is what makes it stutter. This writes a
// compressed JPEG beside each one, in a parallel folder.
//
// Nothing in the products app is modified: the originals stay put, and
// server/index.js serves these in their place when it asks for a frame.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SRC = path.join(root, "src", "products", "assets", "images", "frames");
const OUT = path.join(root, "src", "products", "assets", "images", "frames-optimised");

const SEQUENCES = ["apple", "orange", "dragonfruit"];
// Full source width and a high quality: the earlier 1600px/82 pass was
// visibly softer than the originals when scrubbed. At native width and
// quality 92 the frames are hard to tell from the PNGs, while still
// decoding fast enough to scrub — a 1.3MB PNG costs ~18ms to decode,
// which is more than a whole frame's budget at 60fps.
const TARGET_WIDTH = 1920;
const QUALITY = 92;

for (const seq of SEQUENCES) {
  const srcDir = path.join(SRC, seq);
  const outDir = path.join(OUT, seq);
  if (!fs.existsSync(srcDir)) {
    console.log(`missing sequence: ${srcDir}`);
    continue;
  }
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => /\.png$/i.test(f))
    .sort();

  let before = 0;
  let after = 0;

  for (const file of files) {
    const from = path.join(srcDir, file);
    // Same stem, .jpg extension — server.js maps the request onto it.
    const to = path.join(outDir, file.replace(/\.png$/i, ".jpg"));

    await sharp(from)
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(to);

    before += fs.statSync(from).size;
    after += fs.statSync(to).size;
  }

  const mb = (b) => (b / 1024 / 1024).toFixed(1);
  console.log(
    `${seq}: ${files.length} frames  ${mb(before)}MB -> ${mb(after)}MB  ` +
      `(${(100 - (after / before) * 100).toFixed(0)}% smaller, ` +
      `~${Math.round(after / files.length / 1024)}KB per frame)`
  );
}
