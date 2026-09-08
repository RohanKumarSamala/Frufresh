import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Re-encodes the background clips for the web. They shipped at broadcast
// bitrates — 10Mbps for the hero, 14Mbps for the dragon fruit loop, and
// loading.mp4 was 4K for something never shown above 1440px — where a
// muted background loop wants 2-3Mbps. Nothing here is watched closely;
// they play behind text or under a loading screen.
//
// Quality is set by CRF rather than a target bitrate, so each clip gets
// the bitrate its own content needs to stay visually clean. 22 is below
// the threshold where H.264 artefacts become visible on this material.
//
// -an drops audio outright: every one of these is rendered muted, so the
// audio track was bytes nobody could ever hear.
//
// -movflags +faststart moves the index to the front of the file, so the
// browser can start playing before the whole clip has arrived. Without it
// a 10MB hero video has to download completely before the first frame.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const BACKUP = path.join(root, "..", "Frufresh-original-assets", "video-originals");

const CRF = 22;

const VIDEOS = [
  // 4K down to 1080: it is the full-screen loader, and on a phone it is
  // letterboxed into ~390px.
  { file: "src/assets/video/loading.mp4", maxWidth: 1920 },
  { file: "src/assets/video/hero-section.mp4", maxWidth: 1920 },
  { file: "src/assets/product-page/video/apple-loop.mp4", maxWidth: 1920 },
  { file: "src/assets/product-page/video/oranges-loop.mp4", maxWidth: 1920 },
  { file: "src/assets/product-page/video/dragonfruit-loop.mp4", maxWidth: 1920 },
];

const mb = (n) => (n / 1048576).toFixed(1) + "MB";

fs.mkdirSync(BACKUP, { recursive: true });

let before = 0;
let after = 0;

for (const { file, maxWidth } of VIDEOS) {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) {
    console.log(`missing: ${file}`);
    continue;
  }

  const name = path.basename(src);
  const backup = path.join(BACKUP, name);

  // Encode from the pristine copy, so re-running cannot stack generations
  // of lossy encoding on top of each other.
  if (!fs.existsSync(backup)) fs.copyFileSync(src, backup);

  const origSize = fs.statSync(backup).size;
  const tmp = src + ".tmp.mp4";

  const args = [
    "-y",
    "-i", backup,
    "-c:v", "libx264",
    "-crf", String(CRF),
    "-preset", "slow",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    // Only ever shrink — upscaling a smaller source would add bytes and
    // no detail.
    "-vf", `scale='min(${maxWidth},iw)':-2`,
    "-an",
    "-movflags", "+faststart",
    tmp,
  ];

  const r = spawnSync(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
  if (r.status !== 0) {
    console.error(`${name}: ffmpeg failed\n${r.stderr?.toString().slice(-600)}`);
    fs.rmSync(tmp, { force: true });
    continue;
  }

  const newSize = fs.statSync(tmp).size;
  fs.rmSync(src, { force: true });
  fs.renameSync(tmp, src);

  before += origSize;
  after += newSize;
  console.log(
    `${name.padEnd(24)} ${mb(origSize).padStart(7)} -> ${mb(newSize).padStart(7)}  (${Math.round(100 - (newSize / origSize) * 100)}% smaller)`
  );
}

console.log(`\ntotal ${mb(before)} -> ${mb(after)}  (${Math.round(100 - (after / before) * 100)}% smaller)`);
console.log(`Originals preserved in ${path.relative(root, BACKUP)}`);
