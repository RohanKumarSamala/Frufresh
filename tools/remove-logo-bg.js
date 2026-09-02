import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SRC = path.join(root, "assets", "images", "logo", "logo.png");
const OUT = path.join(root, "src", "assets", "images", "logo.png");

// logo.png already has clean native transparency (solid alpha on the
// artwork, 0 on the background, proper anti-aliased edges in between).
// Just trim the transparent padding around it — don't touch pixels.
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

let minX = width, minY = height, maxX = 0, maxY = 0;
for (let i = 0; i < data.length; i += channels) {
  if (data[i + 3] > 0) {
    const pixelIndex = i / channels;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });

const pad = 10;
const left = Math.max(0, minX - pad);
const top = Math.max(0, minY - pad);
const cropWidth = Math.min(width, maxX + pad) - left;
const cropHeight = Math.min(height, maxY + pad) - top;

await sharp(SRC)
  .extract({ left, top, width: cropWidth, height: cropHeight })
  .png()
  .toFile(OUT);

console.log("Wrote", OUT, `${cropWidth}x${cropHeight}`, "(cropped from", `${width}x${height})`);
