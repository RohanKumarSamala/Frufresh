import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Re-encodes the scroll-scrubbed sequences at the sizes they are actually
// displayed at, and emits a small variant for phones.
//
// Why this exists, measured rather than guessed. Decoding one 1920x1080
// frame costs, on a laptop:
//
//   1920 webp (what shipped)  36.2ms
//   1280 jpeg                 10.7ms
//    720 jpeg                  4.4ms
//
// The budget for a whole frame at 60fps is 16.7ms, so the sequence could
// not hold 30fps while scrubbing no matter how fast the network was — the
// stutter was decode, not download. A phone is roughly 2-3x slower again.
//
// Format is JPEG, not AVIF, for these specifically. AVIF files are ~37%
// smaller but decode slower (13.9ms vs 10.7ms at 1280, 7.6 vs 4.4 at 720),
// and on a sequence that decodes a new frame every scroll tick the decode
// budget is the constraint, not the byte count. Static images elsewhere on
// the site do use AVIF, where decode happens once and size is what counts.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Kept out of the repo: these are the only copies of the hero sequence at
// full size, so the run is reversible.
const BACKUP = path.join(root, "..", "Frufresh-original-assets");

const SEQUENCES = [
  {
    name: "hero",
    src: path.join(root, "src", "assets", "frames", "hero"),
    outDir: path.join(root, "src", "assets", "frames"),
    backup: path.join(BACKUP, "hero-frames-1920-webp"),
  },
  {
    name: "apple",
    src: path.join(root, "src", "assets", "product-page", "images", "frames", "apple"),
    outDir: path.join(root, "src", "assets", "product-page", "images", "frames"),
    backup: path.join(BACKUP, "product-frames-1920", "apple"),
  },
  {
    name: "orange",
    src: path.join(root, "src", "assets", "product-page", "images", "frames", "orange"),
    outDir: path.join(root, "src", "assets", "product-page", "images", "frames"),
    backup: path.join(BACKUP, "product-frames-1920", "orange"),
  },
  {
    name: "dragonfruit",
    src: path.join(root, "src", "assets", "product-page", "images", "frames", "dragonfruit"),
    outDir: path.join(root, "src", "assets", "product-page", "images", "frames"),
    backup: path.join(BACKUP, "product-frames-1920", "dragonfruit"),
  },
];

// Two rungs. 1280 covers laptops at the size the canvas actually paints;
// 720 is generous for a phone, which is at most ~430 CSS px wide and was
// being handed five times the pixels it could show.
const VARIANTS = [
  { suffix: "", width: 1280, quality: 80 },
  { suffix: "-sm", width: 720, quality: 78 },
];

const mb = (n) => (n / 1048576).toFixed(1) + "MB";

function dirSize(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs
    .readdirSync(dir)
    .reduce((a, f) => a + fs.statSync(path.join(dir, f)).size, 0);
}

for (const seq of SEQUENCES) {
  if (!fs.existsSync(seq.src)) {
    console.log(`missing: ${seq.name}`);
    continue;
  }

  const files = fs
    .readdirSync(seq.src)
    .filter((f) => /\.(webp|jpe?g|png)$/i.test(f))
    .sort();

  if (!files.length) {
    console.log(`${seq.name}: nothing to do`);
    continue;
  }

  const before = dirSize(seq.src);

  // Copy the originals out before writing, so a re-run cannot re-encode
  // already-encoded output and compound the loss.
  if (!fs.existsSync(seq.backup)) {
    fs.mkdirSync(seq.backup, { recursive: true });
    for (const f of files) fs.copyFileSync(path.join(seq.src, f), path.join(seq.backup, f));
  }

  // The full-size variant writes back into the directory it read from, so
  // the originals have to go first or the folder ends up holding both —
  // which is exactly what happened the first time this ran, and it is
  // invisible in the output because the new names differ from the old.
  // Safe only because the copy above has already been taken.
  for (const f of files) fs.rmSync(path.join(seq.src, f), { force: true });

  let after = 0;
  for (const v of VARIANTS) {
    const out = path.join(seq.outDir, seq.name + v.suffix);
    fs.mkdirSync(out, { recursive: true });

    for (let i = 0; i < files.length; i++) {
      // Renumbered to a stable 1-indexed name with one extension, so the
      // manifest only needs a prefix and a count.
      const n = String(i + 1).padStart(4, "0");
      await sharp(path.join(seq.backup, files[i]))
        .resize({ width: v.width, withoutEnlargement: true })
        .jpeg({ quality: v.quality, mozjpeg: true, progressive: false })
        .toFile(path.join(out, `frame_${n}.jpg`));
    }
    const size = dirSize(out);
    after += size;
    console.log(
      `  ${(seq.name + v.suffix).padEnd(18)} ${String(files.length).padStart(3)} frames  ${mb(size).padStart(7)}  (${Math.round(size / files.length / 1024)}KB/frame)`
    );
  }

  console.log(
    `${seq.name}: ${mb(before)} -> ${mb(after)} across both variants  (${Math.round(100 - (after / before) * 100)}% smaller)\n`
  );
}

console.log(`Originals preserved in ${path.relative(root, BACKUP)}`);
