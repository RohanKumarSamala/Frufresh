import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

// Frames per sequence, counted from what is actually in
// assets/images/frames/<fruit>/. Exported so App can size the scroll track
// from the same numbers — a fixed track height made the shorter orange
// sequence scroll noticeably slower than apple.
//
// These must match the files on disk exactly: the loader asks for
// frame_001..frame_<count>, so a count higher than the folder holds sends
// it after frames that 404, and the canvas stalls on the last good one.
export const FRAME_COUNTS = { apple: 95, orange: 69, dragonfruit: 144 } as const;

// Share of the page's scroll the looping hero video owns before the frame
// sequence starts turning. Without this the frames begin scrubbing at the
// very first pixel of scroll, underneath a video that is still playing —
// so the sequence was already part-used by the time the video cleared.
// The video now holds this stretch, then hands over.
export const INTRO_FRACTION = 0.12;

// How large the media sits in the frame. 1 = full-bleed cover, leaving no
// margin — which is why the backdrop colour below no longer has to match
// anything. Drop this below 1 and the surrounding tone becomes visible.
//
// The footage is 16:9. Cover-fitting that to a portrait phone scales it
// until it fills the *height*, which on a 390x844 screen means drawing it
// ~1500px wide and showing the middle quarter — the fruit filled the
// screen and the copy sat on top of it with nothing to read against.
// Pulling the scale back lets the studio backdrop return around the
// media, which is what the copy then reads on.
// Kept at or above the point where the media is still wider than the
// viewport (~0.26 here), so it stays full-bleed horizontally and only the
// top and bottom fall back to the backdrop. Below that it detaches into a
// floating panel with visible edges, which reads as a card rather than a
// backdrop.
const MEDIA_SCALE_DESKTOP = 1;
const MEDIA_SCALE_MOBILE = 0.5;

// The footage is 16:9.
const MEDIA_NATIVE = { w: 1920, h: 1080 };

// Sampled from the edges of the media as it actually renders, so the
// margin around the scaled-down footage continues its sweep.
//
// Two sets, because the hero clip and the frame sequence are different
// shots and do not share an edge tone — the apple frames run 216 at the
// edge where its clip runs 228, and the orange and dragon fruit clips are
// macro shots whose edges are the fruit itself rather than any backdrop.
// One constant for both left a visible band against whichever it did not
// match. It only started to matter once MEDIA_SCALE dropped below 1 and
// the margin became visible at all.

// Read by the canvas fill, so measured off the frame sequences.
const BACKDROP = {
  apple: [216, 211, 210] as const,
  orange: [201, 191, 181] as const,
  dragonfruit: [229, 225, 222] as const,
  dark: [8, 8, 10] as const,
};

// Sits behind the hero clip, so measured off the clips themselves.
const VIDEO_BACKDROP = {
  apple: [228, 228, 228] as const,
  orange: [219, 138, 21] as const,
  dragonfruit: [235, 180, 170] as const,
  dark: [8, 8, 10] as const,
};

interface ScrollFrameBackgroundProps {
  fruitId: string; // 'apple' | 'orange' | 'dragonfruit'
  totalFrames?: number;
  isDarkMode?: boolean;
}

export function ScrollFrameBackground({
  fruitId,
  totalFrames = 30,
  isDarkMode = false,
}: ScrollFrameBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const lastRenderedFrameRef = useRef<number>(-1);
  const animationFrameId = useRef<number | null>(null);

  const pickBackdrop = (
    set: typeof BACKDROP | typeof VIDEO_BACKDROP,
    id: string,
    dark: boolean
  ): readonly [number, number, number] => {
    if (dark) return set.dark;
    if (id === 'dragonfruit') return set.dragonfruit;
    if (id === 'orange') return set.orange;
    return set.apple;
  };

  const getBackdropColor = (id: string, dark: boolean) => pickBackdrop(BACKDROP, id, dark);

  const initialBackdrop = getBackdropColor(fruitId, isDarkMode);

  const currentBgR = useRef<number>(initialBackdrop[0]);
  const currentBgG = useRef<number>(initialBackdrop[1]);
  const currentBgB = useRef<number>(initialBackdrop[2]);

  // Held in a ref, not read from props inside the render loop: that loop's
  // effect does not depend on fruitId, so a prop read there could go stale.
  const backdropRef = useRef<readonly [number, number, number]>(initialBackdrop);

  // Same reasoning: the render loop's effect does not depend on this, so it
  // is read through a ref rather than closed over. Rotating a phone has to
  // change the framing, and a stale closure would keep the portrait scale
  // in landscape.
  const isMobile = useIsMobile();
  const mediaScale = isMobile ? MEDIA_SCALE_MOBILE : MEDIA_SCALE_DESKTOP;
  const mediaScaleRef = useRef<number>(mediaScale);

  useEffect(() => {
    mediaScaleRef.current = mediaScale;
    // The loop only redraws when the frame index changes, so a scale change
    // on its own would not repaint until the next scroll.
    lastRenderedFrameRef.current = -1;
  }, [mediaScale]);

  // The box the hero video is drawn into. The canvas fills itself with the
  // backdrop and draws the frame smaller inside it, so at scale < 1 it is
  // still edge to edge; a transform on the video instead shrinks the
  // element, exposing its own edges as a panel floating on the backdrop.
  // Sizing the video to the same box the canvas draws into keeps the two
  // identical — the fruit must not move or resize at the hand-over — and
  // keeps it wider than the viewport, so only top and bottom fall back to
  // the backdrop.
  const [videoBox, setVideoBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const cover = Math.max(
        window.innerWidth / MEDIA_NATIVE.w,
        window.innerHeight / MEDIA_NATIVE.h
      );
      const s = cover * mediaScale;
      setVideoBox({ w: MEDIA_NATIVE.w * s, h: MEDIA_NATIVE.h * s });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [mediaScale]);

  const [activeFruit, setActiveFruit] = useState(fruitId);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Only the two layer-visibility flags live in state. The raw scroll
  // fraction deliberately does not: storing it re-rendered this component
  // on every scroll event, which is what made the scrubbing stutter.
  const [layers, setLayers] = useState({ video: true, canvas: false });

  // Determine total frame count and loop video url based on fruit cultivar
  const frameCount =
    FRAME_COUNTS[fruitId as keyof typeof FRAME_COUNTS] ?? FRAME_COUNTS.apple;
  const loopVideoUrl =
    fruitId === 'dragonfruit'
      ? '/products-assets/video/dragonfruit-loop.mp4'
      : fruitId === 'orange'
      ? '/products-assets/video/oranges-loop.mp4'
      : '/products-assets/video/apple-loop.mp4';

  // Keep the backdrop in step with the cultivar on screen.
  useEffect(() => {
    backdropRef.current = getBackdropColor(fruitId, isDarkMode);
  }, [fruitId, isDarkMode]);

  // The wrapper is only ever visible behind the hero clip — once the
  // sequence takes over, the canvas fills the viewport with its own
  // backdrop — so it takes the tone measured off the clips.
  const activeBackdrop = pickBackdrop(VIDEO_BACKDROP, fruitId, isDarkMode);
  const backdropCss = `rgb(${activeBackdrop.join(', ')})`;

  // .jpg, not .png: the sequences live in the same frames/ folder as
  // before, but re-encoded (tools/convert-product-frames.js). The PNGs
  // decoded in ~18ms — longer than a whole frame at 60fps — so scrubbing
  // dropped a frame every time it reached a new one.
  const getFrameUrl = (fruit: string, index: number) => {
    const padded = String(index).padStart(3, '0');
    return `/products-assets/images/frames/${fruit}/frame_${padded}.jpg`;
  };

  // Preload frames for given fruit
  useEffect(() => {
    let isCancelled = false;

    if (activeFruit !== fruitId) {
      setIsTransitioning(true);
      lastRenderedFrameRef.current = -1;
    }

    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      // Hint the browser to decode off the main thread; primeDecode below
      // is what actually keeps the upcoming run resident.
      img.decoding = 'async';
      img.src = getFrameUrl(fruitId, i);
      img.onload = () => {
        // Only the frame currently on screen is worth forcing a repaint
        // for. Resetting on every one of the 95 loads made the sequence
        // redraw ~95 times while it was still coming in.
        if (i - 1 === lastRenderedFrameRef.current) {
          lastRenderedFrameRef.current = -1;
        }
      };
      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
    setActiveFruit(fruitId);
    lastRenderedFrameRef.current = -1; // Reset to force immediate draw
    
    // Short fade transition on cultivar switch
    const timer = setTimeout(() => {
      if (!isCancelled) {
        setIsTransitioning(false);
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [fruitId, frameCount]);

  // Ensure hero video auto-plays and loops
  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Autoplay fallback
        });
      }
    };
    playVideo();
  }, [fruitId, loopVideoUrl]);

  // Scroll listener & RAF Loop
  useEffect(() => {
    // Returning the previous object when nothing changed lets React bail
    // out of the re-render entirely, so scrolling costs no reconciliation.
    const applyScroll = (fraction: number) => {
      // The video holds the intro, and the canvas is brought up part-way
      // through it so the two cross-fade rather than cutting — both are on
      // a 500ms opacity transition, and the canvas is still showing frame 1
      // for the whole overlap, so nothing moves during the swap.
      const video = fraction < INTRO_FRACTION;
      const canvas = fraction > INTRO_FRACTION * 0.55;
      setLayers((prev) =>
        prev.video === video && prev.canvas === canvas ? prev : { video, canvas }
      );
    };

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        applyScroll(0);
        targetFrameRef.current = 0;
        return;
      }

      const scrollFraction = Math.max(0, Math.min(1, window.scrollY / docHeight));
      applyScroll(scrollFraction);

      // The sequence owns the scroll *after* the intro, remapped so it
      // still runs frame 1 to last across whatever is left.
      const seq = Math.max(
        0,
        (scrollFraction - INTRO_FRACTION) / (1 - INTRO_FRACTION)
      );

      // Deliberately fractional. Flooring here handed the easing below a
      // target that jumped a whole frame at a time, so the motion inherited
      // those steps; the draw rounds to an index anyway, so nothing needs a
      // whole number until then.
      targetFrameRef.current = Math.min(frameCount - 1, seq * (frameCount - 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    // A loaded image is not a decoded one, and the browser evicts bitmaps
    // it cannot keep. The first drawImage of an evicted frame decodes it
    // synchronously on the main thread — the hitch you feel mid-scroll.
    // Keeping a short run ahead of the playhead decoded avoids paying it.
    // Widened from 12: a frame now costs a few ms to decode instead of
    // ~18, and the sequence scrubs faster, so the playhead reaches further
    // ahead between ticks. Cheap frames make a longer runway affordable.
    const DECODE_AHEAD = 20;
    let lastPrimed = -1;
    const primeDecode = (index: number) => {
      if (index === lastPrimed) return;
      lastPrimed = index;
      const from = Math.max(0, index - 1);
      const to = Math.min(imagesRef.current.length, index + DECODE_AHEAD);
      for (let i = from; i < to; i++) {
        const img = imagesRef.current[i] as HTMLImageElement & { decodePrimed?: boolean };
        if (!img || img.decodePrimed || !img.complete || img.naturalWidth === 0) continue;
        img.decodePrimed = true;
        img.decode().catch(() => {
          img.decodePrimed = false;
        });
      }
    };

    const render = () => {
      const canvas = canvasRef.current;
      if (canvas && imagesRef.current.length > 0) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Lerp currentFrame towards targetFrame for liquid-smooth animation
          currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * 0.2;
          
          // Lerp studio background color
          const [targetBgR, targetBgG, targetBgB] = backdropRef.current;

          const prevBgR = currentBgR.current;
          currentBgR.current += (targetBgR - currentBgR.current) * 0.1;
          currentBgG.current += (targetBgG - currentBgG.current) * 0.1;
          currentBgB.current += (targetBgB - currentBgB.current) * 0.1;

          const bgR = Math.round(currentBgR.current);
          const bgG = Math.round(currentBgG.current);
          const bgB = Math.round(currentBgB.current);

          if (Math.abs(prevBgR - currentBgR.current) > 0.05) {
            lastRenderedFrameRef.current = -1; // Force redraw while background lerps
          }

          const frameIndex = Math.max(
            0,
            Math.min(frameCount - 1, Math.round(currentFrameRef.current))
          );

          const img = imagesRef.current[frameIndex];

          // Render as soon as image is complete and frame changes
          if (img && img.complete && img.naturalWidth > 0) {
            if (frameIndex !== lastRenderedFrameRef.current) {
              lastRenderedFrameRef.current = frameIndex;
              // Keep the run in front of the playhead decoded and ready.
              primeDecode(frameIndex);

              // CSS pixels, not canvas.width/height. The context is already
              // scaled by devicePixelRatio, so using the device-pixel size
              // here would draw everything dpr times too large and throw the
              // framing off-centre on any high-DPI screen.
              const cw = canvas.clientWidth || window.innerWidth;
              const ch = canvas.clientHeight || window.innerHeight;
              const iw = img.naturalWidth;
              const ih = img.naturalHeight;

              // Clean centered object-fit cover rendering, scaled down so
              // the fruit sits smaller in the frame. The studio fill above
              // covers whatever the shrunken image no longer reaches.
              const scale = Math.max(cw / iw, ch / ih) * mediaScaleRef.current;
              const imgW = iw * scale;
              const imgH = ih * scale;
              const x = (cw - imgW) / 2;
              const y = (ch - imgH) / 2;

              ctx.clearRect(0, 0, cw, ch);
              ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
              ctx.fillRect(0, 0, cw, ch);
              ctx.drawImage(img, x, y, imgW, imgH);
            }
          } else if (lastRenderedFrameRef.current === -1) {
            const cw = canvas.clientWidth || window.innerWidth;
            const ch = canvas.clientHeight || window.innerHeight;
            ctx.clearRect(0, 0, cw, ch);
            ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
            ctx.fillRect(0, 0, cw, ch);
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [frameCount, isDarkMode]);

  // Handle Resize & Canvas high-DPI sizing
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      lastRenderedFrameRef.current = -1; // Force redraw on resize

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Compute smooth opacity transition between looping video (at scroll 0) and rotating canvas (on scroll)
  const isVideoVisible = layers.video;
  const isCanvasVisible = layers.canvas;

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-300 will-change-transform transform-gpu overflow-hidden ${
        isTransitioning ? 'opacity-30' : 'opacity-100'
      }`}
      // Same tone the canvas fills with, so the margin left by the
      // scaled-down media reads as the studio backdrop continuing.
      style={{ backgroundColor: backdropCss, transition: 'background-color 0.5s ease' }}
    >
      {/* 1. Looping Video in Hero Section */}
      <video
        ref={videoRef}
        key={loopVideoUrl}
        src={loopVideoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute object-cover transition-opacity duration-500 ease-out will-change-transform ${
          isVideoVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={
          videoBox
            ? {
                // Centred on the same box the canvas draws its frame into,
                // so the fruit does not jump at the hand-over.
                width: `${videoBox.w}px`,
                height: `${videoBox.h}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }
            : { width: '100vw', height: '100vh', inset: 0 }
        }
      />

      {/* 2. Scroll-Driven 3D Canvas Frame Animation */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out will-change-transform ${
          isCanvasVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ width: '100vw', height: '100vh', transform: 'translateZ(0)' }}
      />
    </div>
  );
}



