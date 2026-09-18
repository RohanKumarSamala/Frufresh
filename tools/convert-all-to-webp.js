import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Hero frames (desktop & mobile) are kept strictly in JPG format per user requirement.
// Only product page frames are targeted for WebP.
const TARGETS = [
  {
    name: "apple (desktop)",
    dir: path.join(root, "src", "assets", "product-page", "images", "frames", "apple"),
    quality: 98,
  },
  {
    name: "apple-sm (mobile)",
    dir: path.join(root, "src", "assets", "product-page", "images", "frames", "apple-sm"),
    quality: 98,
  },
  {
    name: "dragonfruit (desktop)",
    dir: path.join(root, "src", "assets", "product-page", "images", "frames", "dragonfruit"),
    quality: 98,
  },
  {
    name: "dragonfruit-sm (mobile)",
    dir: path.join(root, "src", "assets", "product-page", "images", "frames", "dragonfruit-sm"),
    quality: 98,
  },
  {
    name: "orange (desktop)",
    dir: path.join(root, "src", "assets", "product-page", "images", "frames", "orange"),
    quality: 98,
  },
  {
    name: "orange-sm (mobile)",
    dir: path.join(root, "src", "assets", "product-page", "images", "frames", "orange-sm"),
    quality: 98,
  },
];

const mb = (bytes) => (bytes / (1024 * 1024)).toFixed(2) + " MB";

async function run() {
  console.log("Restoring original source frames from git to prevent generational loss...");
  execSync("git checkout HEAD -- src/assets/product-page/images/frames/", { cwd: root });

  console.log("Starting WebP conversion (Desktop: 98% quality, Mobile: 98% quality)...\n");

  let totalBefore = 0;
  let totalAfter = 0;
  let totalFiles = 0;

  for (const target of TARGETS) {
    if (!fs.existsSync(target.dir)) {
      console.warn(`Directory not found: ${target.dir}`);
      continue;
    }

    const files = fs
      .readdirSync(target.dir)
      .filter((f) => /^frame_\d+\.(jpg|jpeg)$/i.test(f))
      .sort();

    if (!files.length) {
      console.log(`${target.name}: no jpg files found`);
      continue;
    }

    let dirBefore = 0;
    let dirAfter = 0;

    console.log(`Converting ${target.name}: ${files.length} frames at quality ${target.quality}...`);

    for (const file of files) {
      const srcFile = path.join(target.dir, file);
      const outFile = path.join(target.dir, file.replace(/\.(jpg|jpeg)$/i, ".webp"));

      const srcBuffer = fs.readFileSync(srcFile);
      const srcSize = srcBuffer.length;
      dirBefore += srcSize;

      await sharp(srcBuffer)
        .webp({ quality: target.quality, effort: 4 })
        .toFile(outFile);

      const outStat = fs.statSync(outFile);
      dirAfter += outStat.size;

      // Delete the old jpg file
      fs.unlinkSync(srcFile);
    }

    totalBefore += dirBefore;
    totalAfter += dirAfter;
    totalFiles += files.length;

    console.log(
      `  -> Done: ${mb(dirBefore)} -> ${mb(dirAfter)} (${files.length} frames at 98% quality)\n`
    );
  }

  console.log(`=== Conversion Complete ===`);
  console.log(`Total frames converted: ${totalFiles}`);
  console.log(`Original size: ${mb(totalBefore)} | 98% WebP size: ${mb(totalAfter)}`);
}

run().catch((err) => {
  console.error("Conversion failed:", err);
  process.exit(1);
});
