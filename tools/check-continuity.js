import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Reports where consecutive frames jump. In a continuous shot the
// difference between neighbours is small and even; a hard spike means
// the order is wrong at that point.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const candidates = [
  path.join(root, "src", "assets", "frames", "hero"),
  path.join(root, "assets", "images", "frames", "hero"),
];
const DIR = candidates.find((d) => fs.existsSync(d) && fs.readdirSync(d).length > 0) || candidates[0];

const W = 32;
const H = 18;

const files = fs.existsSync(DIR)
  ? fs
      .readdirSync(DIR)
      .filter((f) => /^frame_\d+\.(png|webp|jpg|jpeg)$/i.test(f))
      .sort()
  : [];


const sigs = [];
for (const f of files) {
  const buf = await sharp(path.join(DIR, f))
    .resize(W, H, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer();
  sigs.push(buf);
}

const diffs = [];
for (let i = 1; i < sigs.length; i++) {
  const a = sigs[i - 1];
  const b = sigs[i];
  let sum = 0;
  for (let p = 0; p < a.length; p++) sum += Math.abs(a[p] - b[p]);
  diffs.push({ from: i, to: i + 1, diff: +(sum / a.length).toFixed(2) });
}

const sorted = [...diffs].sort((x, y) => y.diff - x.diff);
const values = diffs.map((d) => d.diff).sort((a, b) => a - b);
const median = values[Math.floor(values.length / 2)];

console.log(`frames: ${files.length}`);
console.log(`median neighbour diff: ${median}`);
console.log(`\ntop 15 jumps (frame N -> N+1):`);
for (const d of sorted.slice(0, 15)) {
  console.log(
    `  ${String(d.from).padStart(3)} -> ${String(d.to).padStart(3)}   diff ${String(
      d.diff
    ).padStart(7)}   ${(d.diff / median).toFixed(1)}x median`
  );
}
