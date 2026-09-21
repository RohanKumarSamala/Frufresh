import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Builds the phone versions of the home hero: the frame sequence and the
// loop video that plays before it.
//
// Both are drawn cover-fit, and the footage is 16:9. On a portrait phone
// cover-fit scales the frame until it fills the *height*, so only the
// middle ~46% of the width is ever on screen. The earlier phone rung was
// that whole 16:9 frame shrunk to 720 wide — so the strip a phone actually
// shows was ~187 source pixels, stretched across ~780 device pixels at 2x.
// Four times enlarged, and it looked it.
//
// These are instead a centre crop at full resolution: the same strip the
// phone was already showing, but cut from the 1920 original rather than a
// shrunken copy, so it keeps all 1080 rows of detail. The crop is a little
// wider than a phone's aspect (0.6 vs ~0.46) so taller and wider phones
// alike still cover without running out of image.
//
// Sources come straight from git — the commit before the site-wide
// re-encode still holds the original 1920 WebP frames and the unre-encoded
// video — so this can be re-run without any folder outside the repo.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SOURCE_REV = "4f7ffff^";
const CROP_ASPECT = 0.6; // width / height
const FRAME_QUALITY = 85;
const VIDEO_CRF = 20;

const FRAMES_OUT = path.join(root, "src", "assets", "frames", "hero-portrait");
const VIDEO_OUT = path.join(root, "src", "assets", "video", "hero-section-sm.mp4");

const git = (args, opts = {}) =>
  execFileSync("git", args, { cwd: root, maxBuffer: 64 * 1024 * 1024, ...opts });

const mb = (n) => (n / 1048576).toFixed(1) + "MB";

// ---- frames ----------------------------------------------------------
const files = git(["ls-tree", "--name-only", SOURCE_REV, "src/assets/frames/hero/"])
  .toString()
  .trim()
  .split("\n")
  .filter((f) => /\.(webp|jpe?g|png)$/i.test(f))
  .sort();

if (!files.length) {
  console.error(`No source frames at ${SOURCE_REV}`);
  process.exit(1);
}

fs.rmSync(FRAMES_OUT, { recursive: true, force: true });
fs.mkdirSync(FRAMES_OUT, { recursive: true });

let total = 0;
for (let i = 0; i < files.length; i++) {
  const buf = git(["show", `${SOURCE_REV}:${files[i]}`]);
  const img = sharp(buf);
  const { width, height } = await img.metadata();

  const cropW = Math.min(width, Math.round((height * CROP_ASPECT) / 2) * 2);
  const left = Math.round((width - cropW) / 2);

  const out = path.join(FRAMES_OUT, `frame_${String(i + 1).padStart(4, "0")}.jpg`);
  await sharp(buf)
    .extract({ left, top: 0, width: cropW, height })
    .jpeg({ quality: FRAME_QUALITY, mozjpeg: true })
    .toFile(out);
  total += fs.statSync(out).size;
}
console.log(
  `hero-sm  ${files.length} frames  ${mb(total)}  (${Math.round(total / files.length / 1024)}KB/frame)`
);

// ---- loop video --------------------------------------------------------
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "hero-mobile-"));
const srcVideo = path.join(tmpDir, "hero-section.mp4");
fs.writeFileSync(srcVideo, git(["show", `${SOURCE_REV}:src/assets/video/hero-section.mp4`]));

const r = spawnSync(
  ffmpegPath,
  [
    "-y",
    "-i", srcVideo,
    // Centre crop to the same aspect as the frames, full height.
    "-vf", `crop=trunc(ih*${CROP_ASPECT}/2)*2:ih:(iw-trunc(ih*${CROP_ASPECT}/2)*2)/2:0`,
    "-c:v", "libx264",
    "-crf", String(VIDEO_CRF),
    "-preset", "slow",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-an",
    "-movflags", "+faststart",
    VIDEO_OUT,
  ],
  { stdio: ["ignore", "ignore", "pipe"] }
);
fs.rmSync(tmpDir, { recursive: true, force: true });

if (r.status !== 0) {
  console.error("ffmpeg failed:\n" + r.stderr?.toString().slice(-800));
  process.exit(1);
}
console.log(`hero-section-sm.mp4  ${mb(fs.statSync(VIDEO_OUT).size)}`);
