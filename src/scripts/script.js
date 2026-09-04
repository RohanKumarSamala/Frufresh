// ---------------------------------------------------------------
// TUNE THE SCROLL EXPERIENCE HERE
// ---------------------------------------------------------------
const CONFIG = {
  // How much you have to scroll (in viewport-heights) to play through
  // every frame. Bigger number = slower / longer scroll to finish the
  // sequence. Smaller number = faster, snappier.
  scrollLengthVh: 400,

  // How quickly the displayed frame "catches up" to the scroll
  // position, from 0 to 1. 1 = instant/direct (no smoothing, feels
  // exactly glued to the scrollbar). Lower = smoother, more fluid,
  // slight trailing motion (this is what makes pear.no-style scroll
  // feel expensive). Try 0.06–0.2.
  smoothing: 0.12,

  // Scroll (in viewport-heights) spent fading the looping intro video
  // out into the frame sequence. The video loops on its own until this
  // is scrolled through; bigger = a longer, gentler hand-off.
  introVh: 80,

  // Extra scroll (in viewport-heights), after the last frame, spent on
  // the sandy dissolve into the plain section below. Bigger = slower,
  // more deliberate dissolve.
  transitionVh: 140,

  // Size of one grain, in CSS pixels. Smaller = finer, sandier,
  // more photographic. Bigger = chunkier, more pixel-art.
  grainPixel: 3,

  // How wide the sandy scatter band is at the dissolve edge, as a
  // fraction of the screen diagonal. Bigger = longer, softer,
  // more scattered fade. Smaller = a harder, more abrupt edge.
  grainSpread: 0.55,

  // The flat colour the page dissolves into.
  plainColor: "#fefef7",
};
// ---------------------------------------------------------------

const manifestPromise = fetch("config/manifest.json").then((r) => r.json());

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
const scrollTrack = document.getElementById("scroll-track");
const loaderBar = document.getElementById("loader-bar");
const loadingScreen = document.getElementById("loading-screen");
const loadingVideo = document.getElementById("loading-video");
const loadingLogo = document.getElementById("loading-logo");
const brandLogo = document.getElementById("brand-logo");
const loaderFill = document.getElementById("loader-fill");
const plainSection = document.getElementById("plain-section");
const scrollPct = document.getElementById("scroll-pct");
const root = document.documentElement;
const gridOverlay = document.getElementById("grid-overlay");

// Header logo waits out the handoff so the two marks are never both on
// screen. Applied here rather than in the markup deliberately: if this
// script never runs, the logo should still be visible.
if (brandLogo && loadingScreen) brandLogo.classList.add("is-waiting");

// ---- loading screen ------------------------------------------------
// Two gates, and the screen lifts only when both are open:
//   1. the clip has played all the way through, and
//   2. every frame has preloaded.
// Waiting on the frames as well is what keeps the scroll-scrub honest —
// revealing the page early would let you scrub against frames that have
// not arrived yet.
let videoFinished = false;
let framesReady = false;
let loadingDismissed = false;

// A backgrounded tab pauses video, and "ended" would then never fire —
// which would strand the loading screen permanently. This is the escape
// hatch, not the normal path.
const LOADING_MAX_MS = 20000;

// The clip ends on the logo, so rather than cutting to the page we carry
// that mark across: the video steps aside, then the logo shrinks into the
// header logo's position and the real one takes over.
const HANDOFF_FADE_MS = 180; // video out, mark forward
const HANDOFF_SHRINK_MS = 620; // the shrink itself — whole handoff < 1s

// Where the mark sits inside the loading clip's closing frame, as fractions of
// that frame. It is above centre, so a centred overlay would visibly jump
// at the handover. Nudge these if the mark does not sit still.
const VIDEO_NATIVE = { w: 3840, h: 2160 };
const MARK = { cx: 0.511, cy: 0.422, w: 0.479 };

// Places the overlay mark exactly over the one in the video, repeating the
// object-fit: cover maths the video element itself uses — so it lines up at
// any viewport aspect, not just the one this was measured at.
function placeMarkOverVideo() {
  if (!loadingLogo) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.max(vw / VIDEO_NATIVE.w, vh / VIDEO_NATIVE.h);
  const dw = VIDEO_NATIVE.w * scale;
  const dh = VIDEO_NATIVE.h * scale;
  const offsetX = (vw - dw) / 2;
  const offsetY = (vh - dh) / 2;

  const width = MARK.w * dw;
  const height = width * (loadingLogo.naturalHeight / loadingLogo.naturalWidth || 0.4531);

  loadingLogo.style.width = `${width}px`;
  loadingLogo.style.left = `${offsetX + MARK.cx * dw - width / 2}px`;
  loadingLogo.style.top = `${offsetY + MARK.cy * dh - height / 2}px`;
}

// Starts the rules drawing themselves in. Held back until the page is
// actually visible — run any earlier and the whole draw plays out behind
// the loading screen. Safe to call more than once.
function revealGrid() {
  if (gridOverlay) gridOverlay.classList.add("is-ready");
}

function dismissLoadingScreen() {
  // No loading screen in the markup means nothing will ever dismiss one,
  // so the rules have to be released here or they stay collapsed forever.
  if (!loadingScreen) {
    revealGrid();
    return;
  }
  if (loadingDismissed) return;
  if (!videoFinished || !framesReady) return;
  loadingDismissed = true;

  // 1. line the mark up with the clip's own logo, then bring it forward
  //    as the video and backdrop clear away
  placeMarkOverVideo();
  loadingScreen.classList.add("is-handoff");

  setTimeout(() => {
    // 2. Measure where the header logo actually sits and move this one
    //    onto it. Measured rather than hard-coded, so the landing stays
    //    exact at any viewport width — the header logo is clamp()-sized.
    if (loadingLogo && brandLogo) {
      const from = loadingLogo.getBoundingClientRect();
      const to = brandLogo.getBoundingClientRect();

      if (from.width > 0 && to.width > 0) {
        const scale = to.width / from.width;
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);

        loadingLogo.style.transition =
          `transform ${HANDOFF_SHRINK_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        loadingLogo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      }
    }

    // 3. hand over to the real logo once the shrink lands on it, and let
    //    the rules start drawing as the page comes into view
    setTimeout(() => {
      if (brandLogo) brandLogo.classList.remove("is-waiting");
      loadingScreen.style.display = "none";
      if (loadingVideo) loadingVideo.pause();
      revealGrid();
    }, HANDOFF_SHRINK_MS);
  }, HANDOFF_FADE_MS);
}

function markVideoFinished() {
  videoFinished = true;
  dismissLoadingScreen();
}

if (loadingVideo) {
  loadingVideo.addEventListener("ended", markVideoFinished, { once: true });
  // If the clip cannot play at all, it must not hold the page hostage.
  loadingVideo.addEventListener("error", markVideoFinished, { once: true });

  const started = loadingVideo.play();
  if (started && typeof started.catch === "function") {
    started.catch(markVideoFinished);
  }

  setTimeout(markVideoFinished, LOADING_MAX_MS);
} else {
  videoFinished = true;
}

// ---- dynamic guide lines -------------------------------------------
// A tiny copy of the current frame, cover-fitted to the viewport's own
// aspect so its pixel coordinates map straight onto screen position.
let trackCanvas = null;
let trackCtx = null;
let trackW = 64;
let trackH = 36;
let trackTick = 0;

let focusX = 61.5; // % of viewport width
let focusY = 62; // % of viewport height
let focusTargetX = 61.5;
let focusTargetY = 62;
let inStory = false;

// Redraw guards: the canvas only needs repainting when what it shows
// actually changes, or when it is on screen at all.
let lastFrameVars = "";
let lastDrawnIndex = -1;
let lastDrawnDissolve = -1;

// Keep the crosshair off the very edges of the screen.
const FOCUS_BOUNDS = { minX: 10, maxX: 90, minY: 14, maxY: 86 };

let scoreGrid = null;
let integral = null;

function buildTracker() {
  // 64 rather than 96: the readback and the window search are both O(area),
  // so this is a bit over half the work per sample. The search window is a
  // fraction of the width, so the crosshair still lands in the same place.
  trackW = 64;
  // A zero-width viewport (a collapsed or not-yet-laid-out window) makes
  // this ratio Infinity, and getImageData then throws on the size. Fall
  // back to 16:9 rather than let the whole loop die.
  const aspect = window.innerWidth > 0 ? window.innerHeight / window.innerWidth : 9 / 16;
  trackH = Math.max(8, Math.round(trackW * aspect));
  trackCanvas = document.createElement("canvas");
  trackCanvas.width = trackW;
  trackCanvas.height = trackH;
  trackCtx = trackCanvas.getContext("2d", { willReadFrequently: true });

  scoreGrid = new Float32Array(trackW * trackH);
  integral = new Float32Array((trackW + 1) * (trackH + 1));
}

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

// Light background -> dark lines, dark background -> light lines, so
// the grid stays readable over sky, foliage and the plain section alike.
//
// The two thresholds are deliberately far apart: roughly a fifth of the
// frames sit near the midpoint, and a single switch point would let the
// whole grid flicker between light and dark while scrolling through
// them. Once a mode is chosen it holds until the background is clearly
// the other thing.
let inkIsLight = false; // true = light lines over a dark background
let inkApplied = false;

const INK_TO_DARK_ABOVE = 155;
const INK_TO_LIGHT_BELOW = 125;

function setInk(luminance) {
  const was = inkIsLight;
  if (inkIsLight && luminance > INK_TO_DARK_ABOVE) inkIsLight = false;
  else if (!inkIsLight && luminance < INK_TO_LIGHT_BELOW) inkIsLight = true;

  if (inkApplied && was === inkIsLight) return;
  inkApplied = true;

  root.style.setProperty("--ink", inkIsLight ? "rgba(255,255,255,0.34)" : "rgba(20,18,14,0.30)");
  root.style.setProperty(
    "--ink-strong",
    inkIsLight ? "rgba(255,255,255,0.78)" : "rgba(20,18,14,0.62)"
  );
}

// Skin is reddish too, so plain "how red is this pixel" also lights up
// on faces and hands. Apples are separated from skin by *saturation*:
// apple red runs ~0.85, skin ~0.35.
const APPLE_MIN_SAT = 0.5;
const APPLE_MIN_VALUE = 0.15;
// Hue gate, expressed against the red axis to avoid a full HSV convert:
// g-b relative to chroma. Keeps ~345°..20°, which is apple red but not
// the orange of skin.
const HUE_MAX = 1 / 3;
const HUE_MIN = -0.25;

// Side of the search window, as a fraction of the frame width — about
// the size of one apple in shot.
const FOCUS_WINDOW_RATIO = 0.16;
// Bias toward wherever the crosshair already is, so it stays locked on
// the fruit it is following instead of hopping between equally red ones.
const FOCUS_STICKINESS = 0.45;
// Furthest the target may move per measurement, in % of the viewport.
// When the winning apple changes, the crosshair glides across to it
// instead of teleporting — a jump reads as random, a glide reads as
// the camera following something.
const FOCUS_MAX_STEP = 4;

// Find the fruit. Averaging every red pixel drags the crosshair to the
// midpoint of everything reddish in shot — between two apples, or onto
// a face — which is nowhere in particular. So instead: score each pixel
// for "apple", then find the single densest window of that score and
// take the centroid inside it. That locks onto one apple.
function measureFrame(img) {
  if (!trackCtx || !img || !img.complete || img.naturalWidth === 0) return;

  const scale = Math.max(trackW / img.naturalWidth, trackH / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  trackCtx.drawImage(img, (trackW - dw) / 2, (trackH - dh) / 2, dw, dh);

  const { data } = trackCtx.getImageData(0, 0, trackW, trackH);

  let lumSum = 0;

  for (let y = 0, i = 0, k = 0; y < trackH; y++) {
    for (let x = 0; x < trackW; x++, i += 4, k++) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      lumSum += 0.2126 * r + 0.7152 * g + 0.0722 * b;

      const max = r > g ? (r > b ? r : b) : g > b ? g : b;
      const min = r < g ? (r < b ? r : b) : g < b ? g : b;
      const chroma = max - min;

      // Red hues have red as the dominant channel.
      if (chroma === 0 || max !== r) {
        scoreGrid[k] = 0;
        continue;
      }

      const sat = chroma / max;
      const value = max / 255;
      const hue = (g - b) / chroma;

      scoreGrid[k] =
        sat >= APPLE_MIN_SAT && value >= APPLE_MIN_VALUE && hue <= HUE_MAX && hue >= HUE_MIN
          ? sat * value
          : 0;
    }
  }

  setInk(lumSum / (trackW * trackH));

  // Summed-area table, so every candidate window costs four lookups.
  const W1 = trackW + 1;
  for (let y = 0; y < trackH; y++) {
    let rowSum = 0;
    for (let x = 0; x < trackW; x++) {
      rowSum += scoreGrid[y * trackW + x];
      integral[(y + 1) * W1 + (x + 1)] = integral[y * W1 + (x + 1)] + rowSum;
    }
  }

  const win = Math.max(3, Math.round(trackW * FOCUS_WINDOW_RATIO));
  const prevX = (focusTargetX / 100) * (trackW - 1);
  const prevY = (focusTargetY / 100) * (trackH - 1);
  const diag = Math.hypot(trackW, trackH);

  let bestScore = 0;
  let bestSum = 0;
  let bestX = -1;
  let bestY = -1;

  for (let y0 = 0; y0 + win <= trackH; y0++) {
    for (let x0 = 0; x0 + win <= trackW; x0++) {
      const sum =
        integral[(y0 + win) * W1 + (x0 + win)] -
        integral[y0 * W1 + (x0 + win)] -
        integral[(y0 + win) * W1 + x0] +
        integral[y0 * W1 + x0];

      if (sum <= 0) continue;

      const d = Math.hypot(x0 + win / 2 - prevX, y0 + win / 2 - prevY) / diag;
      const score = sum * (1 + FOCUS_STICKINESS * (1 - d));

      if (score > bestScore) {
        bestScore = score;
        bestSum = sum;
        bestX = x0;
        bestY = y0;
      }
    }
  }

  // No fruit in shot: hold the last position rather than drifting off.
  if (bestX < 0 || bestSum <= 0) return;

  let weight = 0;
  let xSum = 0;
  let ySum = 0;
  for (let y = bestY; y < bestY + win; y++) {
    for (let x = bestX; x < bestX + win; x++) {
      const s = scoreGrid[y * trackW + x];
      if (s <= 0) continue;
      weight += s;
      xSum += s * x;
      ySum += s * y;
    }
  }
  if (weight <= 0) return;

  const nextX = clamp(
    (xSum / weight / (trackW - 1)) * 100,
    FOCUS_BOUNDS.minX,
    FOCUS_BOUNDS.maxX
  );
  const nextY = clamp(
    (ySum / weight / (trackH - 1)) * 100,
    FOCUS_BOUNDS.minY,
    FOCUS_BOUNDS.maxY
  );

  // Rate-limit, so switching apples is a glide rather than a teleport.
  const dx = nextX - focusTargetX;
  const dy = nextY - focusTargetY;
  const dist = Math.hypot(dx, dy);

  if (dist > FOCUS_MAX_STEP) {
    focusTargetX += (dx / dist) * FOCUS_MAX_STEP;
    focusTargetY += (dy / dist) * FOCUS_MAX_STEP;
  } else {
    focusTargetX = nextX;
    focusTargetY = nextY;
  }
}

// The picture is never moved — the frame rectangle is. Its choreography
// across the page, in three stages:
//
//   1. rest    it holds perfectly still, wide, while the story plays in
//   2. close   from TRACK_START on, it draws in around the fruit and
//              keeps the fruit centred between the four stars
//   3. story   through the dissolve it settles to a narrow standing
//              frame, which the story section then keeps
//
// `rest` must match the :root defaults in the stylesheet, so the lines
// start exactly where CSS puts them.
const FRAME_RECT = {
  rest: { cx: 50, cy: 41, halfW: 44, halfH: 30 },
  close: { halfW: 16, halfH: 19 },
  // While the dissolve runs the frame sits on the transition itself,
  // which opens out from the middle of the screen.
  transition: { cx: 50, cy: 50, halfW: 22, halfH: 26 },
  // Where it lands afterwards. Only cy/halfH are read from here — the left
  // edge is fixed at STORY_LEFT and the right one follows whichever article
  // is on screen (see ruleRightTarget), so cx/halfW are computed per frame.
  // Top rule at 11%; the bottom rule is pushed off-screen and faded out.
  story: { cx: 50, cy: 55.5, halfW: 44, halfH: 44.5 },
};

// How far through the frame sequence (0..1) the lines begin to move.
// Before this they are completely static.
const TRACK_START = 0.55;
// Point in the dissolve where the frame stops hugging the transition
// and starts opening into the standing story layout.
const DISSOLVE_SPLIT = 0.6;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// The right rule wants to sit differently over the two kinds of section
// below the frame sequence:
//
//   story    a centred column with no portrait, so the rule belongs out on
//            the page margin, bracketing the text rather than crossing it
//   profile  a portrait in the left third, where the rule reads as the
//            divider between that portrait and the paragraphs beside it
//
// So it is not a fixed part of FRAME_RECT.story any more — it follows
// whichever article is on screen, and eases across as you pass between them.
const RULE_RIGHT_STORY = 94;
const RULE_RIGHT_PROFILE = 38.4;
const STORY_LEFT = 6;

const storyArticles = document.querySelectorAll("#plain-section .profile");
let ruleRight = RULE_RIGHT_STORY;

function ruleRightTarget() {
  const mid = window.innerHeight / 2;

  for (const el of storyArticles) {
    const r = el.getBoundingClientRect();
    // Whichever article is crossing the middle of the screen owns the rule.
    if (r.top <= mid && r.bottom >= mid) {
      return el.id === "story" ? RULE_RIGHT_STORY : RULE_RIGHT_PROFILE;
    }
  }

  // In the gaps between articles, hold rather than snapping back.
  return ruleRight;
}

function updateFrameRect() {
  focusX += (focusTargetX - focusX) * 0.06;
  focusY += (focusTargetY - focusY) * 0.06;

  const progress = frameCount > 1 ? currentFrame / (frameCount - 1) : 0;
  const closing = clamp((progress - TRACK_START) / (1 - TRACK_START), 0, 1);

  const rest = FRAME_RECT.rest;
  let cx = lerp(rest.cx, focusX, closing);
  let cy = lerp(rest.cy, focusY, closing);
  let halfW = lerp(rest.halfW, FRAME_RECT.close.halfW, closing);
  let halfH = lerp(rest.halfH, FRAME_RECT.close.halfH, closing);

  // Keep the tracking frame on screen. The story frame below is placed
  // deliberately — its bottom rule sits off-screen — so it is applied
  // after this and left unclamped.
  cx = clamp(cx, halfW + 1, 99 - halfW);
  cy = clamp(cy, halfH + 1, 99 - halfH);

  if (dissolveCurrent > 0) {
    // First settle onto the transition, which opens from the centre...
    const onTransition = clamp(dissolveCurrent / DISSOLVE_SPLIT, 0, 1);
    const trans = FRAME_RECT.transition;
    cx = lerp(cx, trans.cx, onTransition);
    cy = lerp(cy, trans.cy, onTransition);
    halfW = lerp(halfW, trans.halfW, onTransition);
    halfH = lerp(halfH, trans.halfH, onTransition);

    // ...then open out into the standing story layout.
    const onStory = clamp(
      (dissolveCurrent - DISSOLVE_SPLIT) / (1 - DISSOLVE_SPLIT),
      0,
      1
    );
    // The right edge is eased separately, so it can glide between the two
    // section layouts long after the dissolve itself has finished.
    ruleRight += (ruleRightTarget() - ruleRight) * 0.08;

    const story = FRAME_RECT.story;
    const storyCx = (STORY_LEFT + ruleRight) / 2;
    const storyHalfW = (ruleRight - STORY_LEFT) / 2;

    cx = lerp(cx, storyCx, onStory);
    cy = lerp(cy, story.cy, onStory);
    halfW = lerp(halfW, storyHalfW, onStory);
    halfH = lerp(halfH, story.halfH, onStory);
  }

  // Only touch the custom properties when they actually change —
  // writing them every frame forces a style recalculation even when the
  // frame is sitting perfectly still.
  const next = `${(cx - halfW).toFixed(2)} ${(cx + halfW).toFixed(2)} ${(
    cy - halfH
  ).toFixed(2)} ${(cy + halfH).toFixed(2)}`;
  if (next === lastFrameVars) return;
  lastFrameVars = next;

  const [l, r, t, b] = next.split(" ");
  root.style.setProperty("--frame-l", `${l}%`);
  root.style.setProperty("--frame-r", `${r}%`);
  root.style.setProperty("--frame-t", `${t}%`);
  root.style.setProperty("--frame-b", `${b}%`);
}

let images = [];
let frameCount = 0;
let loadedCount = 0;

let targetFrame = 0;
let currentFrame = 0;

let dissolveTarget = 0;
let dissolveCurrent = 0;

// 0 = intro video fully covering, 1 = fully faded into the frames.
let introTarget = 0;
let introCurrent = 0;
let introHidden = false;

const heroLoop = document.getElementById("hero-loop");
const loopVideo = document.getElementById("loop-video");

// Low-resolution "grain buffer": the last frame rendered at one pixel
// per grain. The dissolve runs entirely in this small buffer and is
// then upscaled with smoothing off, which is what gives the sandy,
// speckled edge instead of a soft blur.
let grainCanvas = null;
let grainCtx = null;
let grainBase = null; // ImageData of the last frame
let grainWork = null; // scratch ImageData we mutate each tick
let grainNoise = null; // stable per-grain random threshold
let grainDist = null; // stable per-grain distance from centre
let grainW = 0;
let grainH = 0;
let grainMaxDist = 0;
let grainReady = false;

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

// Derived from CONFIG.plainColor so the dissolve grains and the section
// below can never drift out of sync.
const PLAIN_RGB = hexToRgb(CONFIG.plainColor);

function frameUrl(manifest, index) {
  const n = String(index + 1).padStart(manifest.digits, "0");
  return `${manifest.prefix}${n}.${manifest.ext}`;
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "100vh";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawFrame(index) {
  const img = images[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  // cover-fit (like CSS background-size: cover)
  const scale = Math.max(vw / iw, vh / ih);
  const dw = iw * scale;
  const dh = ih * scale;

  ctx.clearRect(0, 0, vw, vh);
  ctx.drawImage(img, (vw - dw) / 2, (vh - dh) / 2, dw, dh);
}

// A loaded <img> is not necessarily a *decoded* one. The browser cannot
// hold hundreds of full-size bitmaps at once, so it evicts them — and the first
// drawImage of an evicted frame decodes it synchronously, on the main
// thread, which is exactly the hitch you feel mid-scroll.
//
// Decoding a short run ahead of the playhead keeps the frames about to be
// drawn already resident. The window is deliberately small: too long and
// the decodes themselves become the cost they were meant to avoid.
const DECODE_AHEAD = 12;
let lastPrimedIndex = -1;

function primeDecode(index) {
  if (index === lastPrimedIndex) return;
  lastPrimedIndex = index;

  // Prime in the scroll direction, and one behind for a reversal.
  const from = Math.max(0, index - 1);
  const to = Math.min(frameCount, index + DECODE_AHEAD);

  for (let i = from; i < to; i++) {
    const img = images[i];
    if (!img || img.decodePrimed || !img.complete || img.naturalWidth === 0) continue;
    img.decodePrimed = true;
    // Failure here is not interesting — it just means the frame will be
    // decoded the old way, on first draw.
    img.decode().catch(() => {
      img.decodePrimed = false;
    });
  }
}

function closestLoadedIndex(index) {
  if (images[index] && images[index].complete && images[index].naturalWidth > 0) {
    return index;
  }
  for (let r = 1; r < frameCount; r++) {
    const down = index - r;
    const up = index + r;
    if (down >= 0 && images[down]?.complete && images[down].naturalWidth > 0) return down;
    if (up < frameCount && images[up]?.complete && images[up].naturalWidth > 0) return up;
  }
  return null;
}

function buildGrain() {
  const img = images[frameCount - 1];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  grainW = Math.max(1, Math.round(vw / CONFIG.grainPixel));
  grainH = Math.max(1, Math.round(vh / CONFIG.grainPixel));

  grainCanvas = document.createElement("canvas");
  grainCanvas.width = grainW;
  grainCanvas.height = grainH;
  grainCtx = grainCanvas.getContext("2d", { willReadFrequently: true });

  // cover-fit the last frame into the grain buffer
  const scale = Math.max(grainW / img.naturalWidth, grainH / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  grainCtx.drawImage(img, (grainW - dw) / 2, (grainH - dh) / 2, dw, dh);

  grainBase = grainCtx.getImageData(0, 0, grainW, grainH);
  grainWork = grainCtx.createImageData(grainW, grainH);

  const count = grainW * grainH;
  grainNoise = new Float32Array(count);
  grainDist = new Float32Array(count);

  const cx = grainW / 2;
  const cy = grainH / 2;
  grainMaxDist = Math.hypot(cx, cy);

  for (let y = 0, i = 0; y < grainH; y++) {
    for (let x = 0; x < grainW; x++, i++) {
      grainNoise[i] = Math.random();
      const dx = x - cx;
      const dy = y - cy;
      grainDist[i] = Math.sqrt(dx * dx + dy * dy);
    }
  }

  grainReady = true;
  plainSection.style.background = CONFIG.plainColor;
}

function drawDissolve(progress) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!grainReady) {
    drawFrame(frameCount - 1);
    return;
  }

  const base = grainBase.data;
  const work = grainWork.data;

  // The clean zone grows from the centre outwards; `feather` is the
  // width of the band where grains are still scattered around.
  const feather = Math.max(grainMaxDist * CONFIG.grainSpread, 1);
  const reveal = progress * (grainMaxDist + feather);

  const count = grainW * grainH;
  for (let i = 0, p = 0; i < count; i++, p += 4) {
    let t = (reveal - grainDist[i]) / feather;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;

    if (grainNoise[i] < t) {
      work[p] = PLAIN_RGB.r;
      work[p + 1] = PLAIN_RGB.g;
      work[p + 2] = PLAIN_RGB.b;
    } else {
      work[p] = base[p];
      work[p + 1] = base[p + 1];
      work[p + 2] = base[p + 2];
    }
    work[p + 3] = 255;
  }

  grainCtx.putImageData(grainWork, 0, 0);

  ctx.clearRect(0, 0, vw, vh);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(grainCanvas, 0, 0, vw, vh);
  ctx.imageSmoothingEnabled = true;
}

function frameScrollVh() {
  return CONFIG.scrollLengthVh * (frameCount / 100);
}

// Scroll left in the track after the dissolve ends. A sticky element
// unpins one viewport-height before its container does, so the first
// 100vh of this buys nothing — only the excess is real margin. The
// dissolve position is also eased, so it needs that margin to actually
// reach the flat colour before the canvas rides up and away.
const SETTLE_VH = 170;

let trackHeightPx = 0;

function updateScrollHeight() {
  scrollTrack.style.height = `${
    CONFIG.introVh + frameScrollVh() + CONFIG.transitionVh + SETTLE_VH
  }vh`;
  trackHeightPx = scrollTrack.offsetHeight;
}

function onScroll() {
  const vh = window.innerHeight;
  const introPx = (CONFIG.introVh / 100) * vh;
  const framePx = (frameScrollVh() / 100) * vh;
  const transitionPx = (CONFIG.transitionVh / 100) * vh;
  const y = window.scrollY;

  // The intro video owns the first stretch of scroll; the frames only
  // start advancing once it has faded.
  introTarget = introPx > 0 ? clamp(y / introPx, 0, 1) : 1;
  const afterIntro = Math.max(0, y - introPx);

  if (afterIntro <= framePx) {
    const progress = framePx > 0 ? clamp(afterIntro / framePx, 0, 1) : 0;
    targetFrame = progress * (frameCount - 1);
    dissolveTarget = 0;
  } else {
    targetFrame = frameCount - 1;
    dissolveTarget =
      transitionPx > 0 ? clamp((afterIntro - framePx) / transitionPx, 0, 1) : 1;
  }

  // Whole-page progress, so the readout keeps counting through the
  // plain section rather than stopping at the end of the frames.
  const maxScroll = document.documentElement.scrollHeight - vh;
  const pct = maxScroll > 0 ? Math.round((y / maxScroll) * 100) : 0;
  scrollPct.textContent = `${Math.min(Math.max(pct, 0), 100)}%`;
}

// ---- scroll copy ----------------------------------------------------
// Each line owns a window of the frame sequence, written on the element
// as fractions of the way through it. Driven from `currentFrame` rather
// than window.scrollY so the copy inherits the same easing as the frames
// — tied to the scrollbar it would arrive a beat ahead of the picture.
const copyLines = [...document.querySelectorAll("#scroll-copy .copy-line")].map(
  (el) => ({
    el,
    from: parseFloat(el.dataset.from),
    to: parseFloat(el.dataset.to),
    shown: -1,
  })
);

// Share of each window spent fading, at both ends. The rest is the hold.
const COPY_FADE = 0.28;
// How far a line travels as it arrives, in CSS pixels. Small on purpose:
// it should settle, not slide.
const COPY_RISE = 14;

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function updateCopy(progress) {
  for (const line of copyLines) {
    const span = line.to - line.from;
    const t = span > 0 ? (progress - line.from) / span : 0;

    // Distance to the nearer edge of the window, so a line fades in and
    // out symmetrically and reads 0 everywhere outside it.
    const v =
      t > 0 && t < 1
        ? smoothstep(clamp(Math.min(t, 1 - t) / COPY_FADE, 0, 1))
        : 0;

    // Rounded before the guard, so sub-pixel drift cannot churn the
    // style attribute on every single frame.
    const next = Math.round(v * 1000) / 1000;
    if (next === line.shown) continue;
    line.shown = next;

    line.el.style.opacity = next;
    line.el.style.transform = `translateY(${((1 - next) * COPY_RISE).toFixed(2)}px)`;
  }
}

function tick() {
  currentFrame += (targetFrame - currentFrame) * CONFIG.smoothing;
  if (Math.abs(targetFrame - currentFrame) < 0.01) currentFrame = targetFrame;

  dissolveCurrent += (dissolveTarget - dissolveCurrent) * CONFIG.smoothing;
  if (Math.abs(dissolveTarget - dissolveCurrent) < 0.001) dissolveCurrent = dissolveTarget;

  // Once scrolled past the track the canvas is off-screen, and while the
  // story is parked nothing on it changes — in either case repainting
  // ~100k grains every frame is pure waste, and it starves the rest of
  // the page of frames.
  const canvasVisible = trackHeightPx - window.scrollY > 0;

  if (canvasVisible) {
    if (dissolveCurrent > 0.001) {
      if (Math.abs(dissolveCurrent - lastDrawnDissolve) > 0.0005) {
        drawDissolve(dissolveCurrent);
        lastDrawnDissolve = dissolveCurrent;
        lastDrawnIndex = -1;
      }
    } else {
      const drawIndex = closestLoadedIndex(Math.round(currentFrame));
      if (drawIndex !== null && drawIndex !== lastDrawnIndex) {
        drawFrame(drawIndex);
        lastDrawnIndex = drawIndex;
        lastDrawnDissolve = -1;
        // Keep the run in front of the playhead decoded and ready.
        primeDecode(drawIndex);
      }
    }
  }

  // The bottom rule fades and the stepped dashes appear as the frame
  // opens out, so the change of layout happens with the movement.
  const settling = dissolveCurrent > DISSOLVE_SPLIT;
  if (settling !== inStory) {
    inStory = settling;
    gridOverlay.classList.toggle("in-story", inStory);
  }

  if (inStory) {
    setInk(218); // the plain colour is light
    // Every sixth frame, not every third. This pass downscales a full-size
    // frame and then reads the pixels back off the GPU, which is the most
    // expensive thing in the loop; the crosshair is eased on its way to the
    // target anyway, so it loses nothing by being told half as often.
  } else if (++trackTick % 6 === 0) {
    measureFrame(images[closestLoadedIndex(Math.round(currentFrame)) ?? 0]);
  }

  updateCopy(frameCount > 1 ? currentFrame / (frameCount - 1) : 0);
  updateFrameRect();
  updateIntro();

  requestAnimationFrame(tick);
}

// The `autoplay` attribute is not dependable — it is muted so playback
// is allowed, but some browsers still will not start it on their own.
// Ask explicitly, and swallow the rejection if the browser refuses.
function playIntro() {
  if (!loopVideo) return;
  const started = loopVideo.play();
  if (started && typeof started.catch === "function") started.catch(() => {});
}

// Eases the intro video out as you scroll into the frames, and stops it
// decoding once it is no longer visible.
function updateIntro() {
  if (!heroLoop) return;

  introCurrent += (introTarget - introCurrent) * CONFIG.smoothing;
  if (Math.abs(introTarget - introCurrent) < 0.001) introCurrent = introTarget;

  const visible = 1 - introCurrent;
  heroLoop.style.opacity = visible.toFixed(3);

  const shouldHide = visible <= 0.01;
  if (shouldHide === introHidden) return;
  introHidden = shouldHide;

  // Fully transparent still composites and keeps decoding video frames,
  // so take it out of the way and pause it — and put it back if the
  // page is scrolled to the top again.
  heroLoop.style.visibility = shouldHide ? "hidden" : "visible";
  if (shouldHide) loopVideo.pause();
  else playIntro();
}

async function init() {
  const manifest = await manifestPromise;
  frameCount = manifest.count;
  images = new Array(frameCount);

  plainSection.style.background = CONFIG.plainColor;

  updateScrollHeight();
  resizeCanvas();
  buildTracker();

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.decoding = "async";
    img.onload = img.onerror = () => {
      loadedCount++;
      const pct = Math.round((loadedCount / frameCount) * 100);
      loaderFill.style.width = pct + "%";
      if (i === 0) drawFrame(0);
      if (i === frameCount - 1 && img.naturalWidth > 0) buildGrain();
      if (loadedCount === frameCount) {
        loaderBar.classList.add("hidden");
        framesReady = true;
        dismissLoadingScreen();
      }
    };
    img.src = frameUrl(manifest, i);
    images[i] = img;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    resizeCanvas();
    updateScrollHeight();
    buildTracker();
    buildGrain();
    // Setting canvas.width wipes the canvas, so the redraw guards have
    // to be reset or tick() would skip the repaint and leave it blank.
    lastDrawnIndex = -1;
    lastDrawnDissolve = -1;
    onScroll();
  });

  onScroll();
  requestAnimationFrame(tick);
}

init();

// Kick the intro off as soon as there is something to show, and again
// once the file is ready, in case the first attempt was too early.
if (loopVideo) {
  playIntro();
  loopVideo.addEventListener("loadeddata", playIntro, { once: true });
}
