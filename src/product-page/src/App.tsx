import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FRUIT_SPECIMENS } from './data/fruits';
import { FruitSpecimen, FruitId } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PartnershipModal } from './components/PartnershipModal';
import { ScrollFrameBackground } from './components/ScrollFrameBackground';
import { GuideGrid } from './components/GuideGrid';
import { RailNav } from './components/RailNav';
import { MobileNav } from './components/MobileNav';
import { AnatomyOverlay } from './components/AnatomyOverlay';
import { CommercialDossier } from './components/CommercialDossier';
import { ArrowUp, ArrowDown, Send } from 'lucide-react';
import { useIsMobile } from './hooks/useIsMobile';

export default function App() {
  // Robust fruit resolver handling various query parameter formats
  const resolveFruit = (query: string | null): FruitSpecimen => {
    if (!query) return FRUIT_SPECIMENS[0];
    const normalized = query.toLowerCase().replace(/[^a-z]/g, '');
    if (normalized.includes('dragon')) {
      return FRUIT_SPECIMENS.find((f) => f.id === 'dragonfruit') || FRUIT_SPECIMENS[0];
    }
    if (normalized.includes('orange')) {
      return FRUIT_SPECIMENS.find((f) => f.id === 'orange') || FRUIT_SPECIMENS[0];
    }
    return FRUIT_SPECIMENS.find((f) => f.id === 'apple') || FRUIT_SPECIMENS[0];
  };

  const initialFruit = resolveFruit(new URLSearchParams(window.location.search).get('fruit'));

  const [fruits] = useState<FruitSpecimen[]>(FRUIT_SPECIMENS);
  const [selectedFruit, setSelectedFruit] = useState<FruitSpecimen>(initialFruit);
  const [activeView, setActiveView] = useState<FruitId>(initialFruit.id as FruitId);
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrubProgress, setScrubProgress] = useState(0);
  const [mobilePhase2Tab, setMobilePhase2Tab] = useState<'origin' | 'taste'>('origin');
  const [mobilePhase3Tab, setMobilePhase3Tab] = useState<'varieties' | 'specs'>('varieties');

  // Synchronize mobile chapter tabs with user's scrub progress
  useEffect(() => {
    if (scrubProgress < 0.32) {
      setMobilePhase2Tab('origin');
    } else {
      setMobilePhase2Tab('taste');
    }

    if (scrubProgress < 0.62) {
      setMobilePhase3Tab('varieties');
    } else {
      setMobilePhase3Tab('specs');
    }
  }, [scrubProgress]);

  // Stepped Autoscroll & Presentation Architecture
  // Stage 0: Hero
  // Stage 1: Phase 2 (Origin & Pipeline + Taste Architecture)
  // Stage 2: Phase 3 (Import Varieties + Packing Specs)
  // Stage 3: Phase 4 (Sliced Fruit Internal Quality Anatomy)
  // Stage 4: Top of Commercial Dossier (Seasonality & Quality Standards)
  // Stage 5: B2B Wholesale Allocation & Form
  // Stepped Autoscroll ONLY for the 3D rotating fruit frames section:
  // Stage 0: Hero (whole fruit facing forward)
  // Stage 1: Phase 2 (Origin & Pipeline + Taste Architecture)
  // Stage 2: Phase 3 (Import Varieties + Packing Specs)
  // Stage 3: Phase 4 (Sliced Fruit Internal Quality Anatomy)
  // ANY PART OF THE PAGE AFTER THE FRAMES SECTION IS 100% NATIVE SCROLL (NO AUTO SCROLL).
  const TOTAL_STAGES = 4;
  const isAnimatingRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const coolDownUntilRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const touchStartYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Helper to reliably read track height
  const getScrubTrackHeight = useCallback((): number => {
    const scrubEl = document.getElementById('fruit-scrub-track');
    return scrubEl
      ? Math.max(1, scrubEl.offsetHeight - window.innerHeight)
      : Math.max(1, window.innerHeight * 2.2);
  }, []);

  // Map each presentation stage to an exact scroll position (in pixels)
  const getStageTargetY = useCallback(
    (stageIndex: number): number => {
      const scrubHeight = getScrubTrackHeight();

      if (stageIndex <= 0) return 0; // Stage 0: Hero section
      if (stageIndex === 1) return Math.round(scrubHeight * 0.30); // Stage 1: Origin & Taste ratings
      if (stageIndex === 2) return Math.round(scrubHeight * 0.60); // Stage 2: Varieties & Packing specs
      return scrubHeight; // Stage 3: Sliced fruit anatomy (final frame of specimen)
    },
    [getScrubTrackHeight]
  );

  // Compute current stage from active scroll position
  const getCurrentStage = useCallback((): number => {
    const y = window.scrollY;
    const scrubHeight = getScrubTrackHeight();

    if (y < scrubHeight * 0.16) return 0;
    if (y < scrubHeight * 0.45) return 1;
    if (y < scrubHeight * 0.80) return 2;
    return 3; // Stage 3: Sliced fruit anatomy (last frame)
  }, [getScrubTrackHeight]);

  // Smooth liquid cubic ease-out animation to target stage
  const goToStage = useCallback(
    (stageIndex: number) => {
      const targetY = getStageTargetY(stageIndex);
      const startY = window.scrollY;
      const distance = targetY - startY;

      if (Math.abs(distance) < 6) return;

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      isAnimatingRef.current = true;
      const duration = 650;
      const startTime = performance.now();

      // Cubic ease-out: smooth initial launch, gentle, luxurious deceleration
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(p);

        window.scrollTo(0, Math.round(startY + distance * eased));

        if (p < 1) {
          rafIdRef.current = requestAnimationFrame(tick);
        } else {
          window.scrollTo(0, targetY);
          isAnimatingRef.current = false;
        }
      };

      rafIdRef.current = requestAnimationFrame(tick);
    },
    [getStageTargetY]
  );

  // Measure scrub progress across the 3D specimen stage
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);

      const scrubEl = document.getElementById('fruit-scrub-track');
      const scrubTrackHeight = scrubEl
        ? scrubEl.offsetHeight - window.innerHeight
        : window.innerHeight * 2.0;

      if (scrubTrackHeight > 0) {
        setScrubProgress(Math.max(0, Math.min(1, currentY / scrubTrackHeight)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stepped autoscroll gesture interception (Wheel, Touch, Keyboard) with momentum protection
  // EXCLUSIVELY active within the 3D rotating fruit frames section.
  // After the frames section (window.scrollY >= scrubTrackHeight), all scrolling is 100% native.
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isPartnershipOpen) return;

      const scrubTrackHeight = getScrubTrackHeight();
      const currentY = window.scrollY;

      // 1. In the commercial dossier (strictly past the frames section),
      // wheel events are NEVER intercepted and native browser scrolling runs 100% unrestricted.
      if (currentY > scrubTrackHeight) {
        return;
      }

      // 2. When at Stage 3 (last frame / sliced fruit) and scrolling DOWN into the dossier,
      // never intercept! Native browser scrolling smoothly glides right into the information.
      if (currentY >= scrubTrackHeight - 8 && e.deltaY > 0) {
        return;
      }

      const now = performance.now();
      const timeDelta = now - lastWheelTimeRef.current;
      lastWheelTimeRef.current = now;

      // While animation is actively running, absorb wheel events so they don't fight the animation
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      // If within cooldown period after a triggered transition, absorb trailing momentum
      if (now < coolDownUntilRef.current) {
        e.preventDefault();
        return;
      }

      // If user paused between gestures (>160ms), reset accumulated delta
      if (timeDelta > 160) {
        accumulatedDeltaRef.current = 0;
      }

      accumulatedDeltaRef.current += e.deltaY;

      // Deliberate threshold to trigger next stage (absorbs micro-jitters)
      const THRESHOLD = 30;
      if (Math.abs(accumulatedDeltaRef.current) >= THRESHOLD) {
        const direction = accumulatedDeltaRef.current > 0 ? 1 : -1;
        accumulatedDeltaRef.current = 0;

        const currentStage = getCurrentStage();

        // If at the final frame stage (Stage 3) and scrolling down: NO AUTO SCROLL!
        // Allow native scrolling without intercepting or locking.
        if (currentStage >= TOTAL_STAGES - 1 && direction > 0) {
          return;
        }

        const nextStage = Math.max(0, Math.min(TOTAL_STAGES - 1, currentStage + direction));
        if (nextStage !== currentStage) {
          e.preventDefault();
          coolDownUntilRef.current = now + 480;
          goToStage(nextStage);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const scrubTrackHeight = getScrubTrackHeight();

      // In or past the dossier: completely native touch scrolling
      if (window.scrollY > scrubTrackHeight) return;

      // When at Stage 3 and swiping up (scrolling down into dossier): completely native
      if (window.scrollY >= scrubTrackHeight - 8) return;

      if (isAnimatingRef.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isPartnershipOpen || isAnimatingRef.current) return;

      const scrubTrackHeight = getScrubTrackHeight();
      const currentY = window.scrollY;

      // In or past the dossier: completely native touch scrolling
      if (currentY > scrubTrackHeight) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartYRef.current - touchEndY; // positive = swipe up = scroll down

      // If at or past Stage 3 and swiping up (scrolling DOWN into dossier): 100% native!
      if (currentY >= scrubTrackHeight - 8 && diffY > 0) return;

      const now = performance.now();
      if (now < coolDownUntilRef.current) return;

      if (Math.abs(diffY) > 35) {
        const direction = diffY > 0 ? 1 : -1;

        const currentStage = getCurrentStage();
        // If at final frame stage (Stage 3) and swiping up (scrolling down): NO AUTO SCROLL!
        if (currentStage >= TOTAL_STAGES - 1 && direction > 0) {
          return;
        }

        const nextStage = Math.max(0, Math.min(TOTAL_STAGES - 1, currentStage + direction));
        if (nextStage !== currentStage) {
          coolDownUntilRef.current = now + 450;
          goToStage(nextStage);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPartnershipOpen || isAnimatingRef.current) return;

      const scrubTrackHeight = getScrubTrackHeight();
      const currentY = window.scrollY;

      // In or past the dossier: keyboard arrows and page keys scroll 100% natively
      if (currentY > scrubTrackHeight) return;

      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        const currentStage = getCurrentStage();
        if (currentStage >= TOTAL_STAGES - 1 || currentY >= scrubTrackHeight - 8) {
          // At or after Stage 3: let keys scroll natively down into the dossier!
          return;
        }
        e.preventDefault();
        goToStage(currentStage + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        const currentStage = getCurrentStage();
        const nextStage = Math.max(0, currentStage - 1);
        goToStage(nextStage);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToStage(0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isPartnershipOpen, getCurrentStage, goToStage, getScrubTrackHeight]);

  const handleSelectView = (view: FruitId) => {
    setActiveView(view);
    const fruit = fruits.find((f) => f.id === view) || fruits[0];
    setSelectedFruit(fruit);
    const newUrl = `${window.location.pathname}?fruit=${fruit.id}`;
    window.history.pushState({ fruitId: fruit.id }, '', newUrl);
    goToStage(0);
  };

  const handleSelectNextFruit = () => {
    const currentIndex = fruits.findIndex((f) => f.id === selectedFruit.id);
    const nextIndex = (currentIndex + 1) % fruits.length;
    const nextFruit = fruits[nextIndex];
    setSelectedFruit(nextFruit);
    setActiveView(nextFruit.id as FruitId);
    const newUrl = `${window.location.pathname}?fruit=${nextFruit.id}`;
    window.history.pushState({ fruitId: nextFruit.id }, '', newUrl);
    goToStage(0);
  };

  const isApple = selectedFruit.id === 'apple';
  const isOrange = selectedFruit.id === 'orange';
  const isDarkMode = false;
  const accentColor = isApple ? '#8e1d24' : isOrange ? '#c2410c' : '#be185d';

  // Helper for smooth continuous cross-fading without blank dead-zones
  const calcOpacity = (start: number, end: number, fade = 0.05): number => {
    if (scrubProgress < start - fade || scrubProgress > end + fade) return 0;
    if (scrubProgress < start) return Math.max(0, Math.min(1, (scrubProgress - (start - fade)) / fade));
    if (scrubProgress > end) return Math.max(0, Math.min(1, ((end + fade) - scrubProgress) / fade));
    return 1;
  };

  const heroOpacity = calcOpacity(0, 0.14, 0.04);
  const phase2Opacity = calcOpacity(0.18, 0.44, 0.06);
  const phase3Opacity = calcOpacity(0.48, 0.74, 0.06);

  const isMobile = useIsMobile();
  // Background styling on mobile is ONLY for apple; orange and dragon fruit use their original full-bleed hero presentation
  const mobileBgCss = isApple ? 'rgb(221, 222, 222)' : undefined;

  return (
    <div
      id="fruit-website-root"
      className="min-h-screen relative flex flex-col justify-between overflow-x-hidden bg-[#fefef7] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-white transition-colors duration-700 ease-in-out"
      style={isMobile && mobileBgCss ? { backgroundColor: mobileBgCss } : undefined}
    >
      {/* Scroll-Driven 3D Frame Background with Looping Video */}
      <ScrollFrameBackground fruitId={selectedFruit.id} isDarkMode={isDarkMode} />

      {/* Guide Grid with Hairline Architectural Rules */}
      <GuideGrid />

      {/* Left-Rail Navigation (Desktop) & Mobile Drawer Navigation */}
      <RailNav activeView={activeView} onSelectView={handleSelectView} />
      <MobileNav
        fruits={fruits}
        activeView={activeView}
        onSelectView={handleSelectView}
      />

      {/* Architectural Header */}
      <Header
        fruits={fruits}
        selectedFruit={selectedFruit}
        activeView={activeView}
        onSelectView={handleSelectView}
        onOpenPartnership={() => setIsPartnershipOpen(true)}
        isDarkMode={isDarkMode}
      />

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-1 flex flex-col justify-between">
        {/* ========================================================================= */}
        {/* STAGE 1: 3D ROTATING FRUIT SCRUB TRACK (Hero + Flanking Chapters + Anatomy) */}
        {/* ========================================================================= */}
        <div id="fruit-scrub-track" className="relative min-h-[280vh] sm:min-h-[320vh] px-4 sm:px-8 md:px-12">
          {/* 01 HERO SECTION (Top of Page: 0% scroll) */}
          <div
            className="transition-all duration-300"
            style={{
              opacity: heroOpacity,
              pointerEvents: heroOpacity > 0.2 ? 'auto' : 'none',
              transform: `translateY(${(1 - heroOpacity) * -16}px)`,
            }}
          >
            <HeroSection
              selectedFruit={selectedFruit}
              onOpenPartnership={() => setIsPartnershipOpen(true)}
              onSelectNextFruit={handleSelectNextFruit}
              onNavigateStage={goToStage}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* ======================================================================= */}
          {/* PHASE 2: WHOLE FRUIT ROTATION (~16% - 44% scrub)                       */}
          {/* LEFT FLANK: [ 02 // ORIGIN & PIPELINE ]                                */}
          {/* RIGHT FLANK: [ 04 // TASTE PROFILE & STAR RATINGS ]                     */}
          {/* ======================================================================= */}

          {/* Left Flank: Origin & Sourcing Journey (Desktop Flank - Untouched) */}
          <div
            className="fr-chapter hidden sm:block fixed sm:top-1/2 sm:-translate-y-1/2 sm:left-[calc(var(--fr-l)+36px)] xl:left-[calc(var(--fr-l)+48px)] w-full sm:max-w-[330px] lg:max-w-[370px] xl:max-w-[400px] z-20 pointer-events-auto transition-opacity duration-300 select-none"
            style={{
              opacity: phase2Opacity,
              pointerEvents: phase2Opacity > 0.2 ? 'auto' : 'none',
            }}
          >
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="font-mono text-[9px] font-bold text-[#8e1d24] uppercase tracking-widest">
                  [ 02 // ORIGIN & PIPELINE ]
                </span>
              </div>
              <h3 className="fr-heading font-serif !text-xl sm:!text-2xl text-[#1A1A1A] leading-snug">
                {isApple
                  ? 'Pacific Northwest & Trentino Glacial Valleys.'
                  : isOrange
                  ? 'Etna Volcanic Ash & Mediterranean Sun.'
                  : 'Binh Thuan Coastal Volcanic Alluvium.'}
              </h3>
              <div className="space-y-2.5 font-mono text-[11px] text-black/75 pt-1">
                <div className="border-b border-black/10 pb-1.5 flex items-baseline justify-between gap-3">
                  <span className="text-black/40 uppercase text-[9px] tracking-wider shrink-0">TERROIR:</span>
                  <span className="text-[#1A1A1A] font-medium text-right">
                    {selectedFruit.originStory.growingRegions.slice(0, 2).join(', ')}
                  </span>
                </div>
                <div className="border-b border-black/10 pb-1.5 flex items-baseline justify-between gap-3">
                  <span className="text-black/40 uppercase text-[9px] tracking-wider shrink-0">ROUTE:</span>
                  <span className="text-[#1A1A1A] font-medium text-right">
                    CA Reefer to Nhava Sheva & Chennai
                  </span>
                </div>
                <div className="pt-0.5 text-xs font-sans text-black/80 leading-relaxed">
                  {selectedFruit.originStory.packhouse}
                </div>
              </div>
            </div>
          </div>

          {/* Right Flank: Taste Profile & Star Ratings (Desktop Flank - Untouched) */}
          <div
            className="fr-chapter hidden sm:block fixed sm:top-1/2 sm:-translate-y-1/2 sm:right-[calc(var(--fr-l)+36px)] xl:right-[calc(var(--fr-l)+48px)] w-full sm:max-w-[330px] lg:max-w-[370px] xl:max-w-[400px] z-20 pointer-events-auto transition-opacity duration-300 select-none text-left"
            style={{
              opacity: phase2Opacity,
              pointerEvents: phase2Opacity > 0.2 ? 'auto' : 'none',
            }}
          >
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="font-mono text-[9px] font-bold text-[#8e1d24] uppercase tracking-widest">
                  [ 04 // TASTE ARCHITECTURE ]
                </span>
              </div>
              <h3 className="fr-heading font-serif !text-xl sm:!text-2xl text-[#1A1A1A] leading-snug">
                {isApple
                  ? 'High Acoustic Crispness & Malic Core.'
                  : isOrange
                  ? 'High Juice Yield & Citrus Aromatics.'
                  : 'Floral Sweetness & Crisp Micro-Seed Snap.'}
              </h3>

              {/* Star Ratings Grid */}
              <div className="space-y-2 pt-1 font-mono text-[11px]">
                <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
                  <span className="text-black/50 uppercase tracking-wider text-[10px]">Sweetness</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 tracking-tighter text-xs">
                      {'★'.repeat(Math.round(selectedFruit.sensoryRatings.sweetness)) +
                        '☆'.repeat(5 - Math.round(selectedFruit.sensoryRatings.sweetness))}
                    </span>
                    <span className="text-black/80 font-bold">
                      {selectedFruit.sensoryRatings.sweetness}/5
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
                  <span className="text-black/50 uppercase tracking-wider text-[10px]">Crispness / Yield</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 tracking-tighter text-xs">
                      {'★'.repeat(Math.round(selectedFruit.sensoryRatings.crispness)) +
                        '☆'.repeat(5 - Math.round(selectedFruit.sensoryRatings.crispness))}
                    </span>
                    <span className="text-black/80 font-bold">
                      {selectedFruit.sensoryRatings.crispness}/5
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
                  <span className="text-black/50 uppercase tracking-wider text-[10px]">Acidity</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 tracking-tighter text-xs">
                      {'★'.repeat(Math.round(selectedFruit.sensoryRatings.acidity)) +
                        '☆'.repeat(5 - Math.round(selectedFruit.sensoryRatings.acidity))}
                    </span>
                    <span className="text-black/80 font-bold">
                      {selectedFruit.sensoryRatings.acidity}/5
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
                  <span className="text-black/50 uppercase tracking-wider text-[10px]">Aroma Index</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 tracking-tighter text-xs">
                      {'★'.repeat(Math.round(selectedFruit.sensoryRatings.aroma)) +
                        '☆'.repeat(5 - Math.round(selectedFruit.sensoryRatings.aroma))}
                    </span>
                    <span className="text-black/80 font-bold">
                      {selectedFruit.sensoryRatings.aroma}/5
                    </span>
                  </div>
                </div>
              </div>

              <p className="font-sans text-xs text-black/75 leading-relaxed pt-1">
                {selectedFruit.description}
              </p>
            </div>
          </div>

          {/* Dedicated Mobile Phase 2 Card: Single clean docked card with segmented tabs */}
          <div
            className="sm:hidden fixed bottom-5 inset-x-4 z-30 pointer-events-auto transition-opacity duration-300 select-none"
            style={{
              opacity: phase2Opacity,
              pointerEvents: phase2Opacity > 0.2 ? 'auto' : 'none',
            }}
          >
            <div className="bg-white/92 backdrop-blur-xl border border-black/10 rounded-2xl p-4 shadow-xl">
              {/* Segmented Tab Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-black/[0.04] rounded-xl border border-black/5 mb-3">
                <button
                  type="button"
                  onClick={() => setMobilePhase2Tab('origin')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-center font-mono text-[9.5px] uppercase tracking-wider transition-all ${
                    mobilePhase2Tab === 'origin'
                      ? 'bg-white shadow-sm font-bold text-[#1A1A1A]'
                      : 'text-black/50 hover:text-black/80'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    02 // Origin
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobilePhase2Tab('taste')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-center font-mono text-[9.5px] uppercase tracking-wider transition-all ${
                    mobilePhase2Tab === 'taste'
                      ? 'bg-white shadow-sm font-bold text-[#1A1A1A]'
                      : 'text-black/50 hover:text-black/80'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    04 // Taste
                  </span>
                </button>
              </div>

              {/* Tab 1: Origin & Pipeline */}
              {mobilePhase2Tab === 'origin' ? (
                <div className="space-y-2 text-left animate-in fade-in duration-200">
                  <h3 className="font-serif text-lg text-[#1A1A1A] leading-snug">
                    {isApple
                      ? 'Pacific Northwest & Trentino Glacial Valleys.'
                      : isOrange
                      ? 'Etna Volcanic Ash & Mediterranean Sun.'
                      : 'Binh Thuan Coastal Volcanic Alluvium.'}
                  </h3>
                  <div className="space-y-1.5 font-mono text-[10.5px] text-black/75 pt-0.5">
                    <div className="flex items-baseline justify-between border-b border-black/10 pb-1 gap-2">
                      <span className="text-black/40 uppercase text-[9px] tracking-wider shrink-0">TERROIR:</span>
                      <span className="text-[#1A1A1A] font-medium text-right truncate">
                        {selectedFruit.originStory.growingRegions.slice(0, 2).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-black/10 pb-1 gap-2">
                      <span className="text-black/40 uppercase text-[9px] tracking-wider shrink-0">ROUTE:</span>
                      <span className="text-[#1A1A1A] font-medium text-right">
                        CA Reefer to Nhava Sheva & Chennai
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-black/80 leading-snug line-clamp-2 pt-0.5">
                      {selectedFruit.originStory.packhouse}
                    </p>
                  </div>
                </div>
              ) : (
                /* Tab 2: Taste Architecture & Star Ratings */
                <div className="space-y-2 text-left animate-in fade-in duration-200">
                  <h3 className="font-serif text-lg text-[#1A1A1A] leading-snug">
                    {isApple
                      ? 'High Acoustic Crispness & Malic Core.'
                      : isOrange
                      ? 'High Juice Yield & Citrus Aromatics.'
                      : 'Floral Sweetness & Crisp Micro-Seed Snap.'}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[10.5px] border-y border-black/10 py-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-black/50 text-[9px] uppercase tracking-wider">SWEET</span>
                      <span className="text-amber-600 font-bold text-[10px]">
                        {'★'.repeat(Math.round(selectedFruit.sensoryRatings.sweetness))} {selectedFruit.sensoryRatings.sweetness}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black/50 text-[9px] uppercase tracking-wider">CRISP</span>
                      <span className="text-amber-600 font-bold text-[10px]">
                        {'★'.repeat(Math.round(selectedFruit.sensoryRatings.crispness))} {selectedFruit.sensoryRatings.crispness}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black/50 text-[9px] uppercase tracking-wider">ACID</span>
                      <span className="text-amber-600 font-bold text-[10px]">
                        {'★'.repeat(Math.round(selectedFruit.sensoryRatings.acidity))} {selectedFruit.sensoryRatings.acidity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black/50 text-[9px] uppercase tracking-wider">AROMA</span>
                      <span className="text-amber-600 font-bold text-[10px]">
                        {'★'.repeat(Math.round(selectedFruit.sensoryRatings.aroma))} {selectedFruit.sensoryRatings.aroma}
                      </span>
                    </div>
                  </div>
                  <p className="font-sans text-[11px] text-black/75 leading-snug line-clamp-2">
                    {selectedFruit.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================================= */}
          {/* PHASE 3: MID-SPIN TOWARD CUT (~48% - 72% scrub)                        */}
          {/* LEFT FLANK: [ 03 // IMPORT VARIETIES ]                                 */}
          {/* RIGHT FLANK: [ 07 // PACKING & SPECIFICATIONS ]                         */}
          {/* ======================================================================= */}

          {/* Left Flank: Commercial Import Varieties (Desktop Flank - Untouched) */}
          <div
            className="fr-chapter hidden sm:block fixed sm:top-1/2 sm:-translate-y-1/2 sm:left-[calc(var(--fr-l)+36px)] xl:left-[calc(var(--fr-l)+48px)] w-full sm:max-w-[330px] lg:max-w-[370px] xl:max-w-[400px] z-20 pointer-events-auto transition-opacity duration-300 select-none"
            style={{
              opacity: phase3Opacity,
              pointerEvents: phase3Opacity > 0.2 ? 'auto' : 'none',
            }}
          >
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="font-mono text-[9px] font-bold text-[#8e1d24] uppercase tracking-widest">
                  [ 03 // IMPORT VARIETIES ]
                </span>
              </div>
              <h3 className="fr-heading font-serif !text-xl sm:!text-2xl text-[#1A1A1A] leading-snug">
                Prime Commercial Import Catalogue
              </h3>
              <div className="space-y-2 pt-1">
                {selectedFruit.varieties.slice(0, 4).map((v) => (
                  <div key={v.id} className="border-b border-black/10 pb-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#1A1A1A] tracking-tight">{v.name}</span>
                      <span className="text-[#8e1d24] font-medium text-[10px] whitespace-nowrap">{v.seasonWindow}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-black/60 text-[10px] mt-1">
                      <span className="truncate pr-1">{v.tasteProfile ? v.tasteProfile.split(',')[0] : v.notes.split('.')[0]}</span>
                      <span className="font-bold text-black/85 whitespace-nowrap px-1.5 py-0.5 rounded bg-black/[0.04] text-[9.5px]">
                        {v.brix}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Flank: Caliber & Packaging Logistics (Desktop Flank - Untouched) */}
          <div
            className="fr-chapter hidden sm:block fixed sm:top-1/2 sm:-translate-y-1/2 sm:right-[calc(var(--fr-l)+36px)] xl:right-[calc(var(--fr-l)+48px)] w-full sm:max-w-[330px] lg:max-w-[370px] xl:max-w-[400px] z-20 pointer-events-auto transition-opacity duration-300 select-none text-left"
            style={{
              opacity: phase3Opacity,
              pointerEvents: phase3Opacity > 0.2 ? 'auto' : 'none',
            }}
          >
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="font-mono text-[9px] font-bold text-[#8e1d24] uppercase tracking-widest">
                  [ 07 // PACKING & SPECS ]
                </span>
              </div>
              <h3 className="fr-heading font-serif !text-xl sm:!text-2xl text-[#1A1A1A] leading-snug">
                Export Calibers & Cold-Chain Protocol
              </h3>
              <div className="space-y-2.5 font-mono text-[11px] text-black/75 pt-1">
                <div className="border-b border-black/10 pb-1.5 flex items-baseline justify-between gap-3">
                  <span className="text-black/40 uppercase block text-[9px] tracking-wider shrink-0">COUNT SIZES</span>
                  <span className="text-[#1A1A1A] font-semibold text-right">
                    {selectedFruit.packingSpecs.counts.slice(0, 6).join(', ')}...
                  </span>
                </div>
                <div className="border-b border-black/10 pb-1.5 flex flex-col gap-0.5">
                  <span className="text-black/40 uppercase block text-[9px] tracking-wider">PACKAGING FORMATS</span>
                  <span className="text-[#1A1A1A] text-[10.5px]">
                    {selectedFruit.packingSpecs.formats.map((f) => f.name).join(' • ')}
                  </span>
                </div>
                <div className="border-b border-black/10 pb-1.5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-black/40 uppercase block text-[9px] tracking-wider">STORAGE TEMP</span>
                    <span className="text-[#1A1A1A] font-medium">
                      {selectedFruit.qualityGuide.coldChainTemp.split('(')[0]}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-black/40 uppercase block text-[9px] tracking-wider">PAYLOAD</span>
                    <span className="text-[#1A1A1A] font-medium">
                      20–22 Pallets / 40ft
                    </span>
                  </div>
                </div>
                <div className="pt-0.5 flex items-center justify-between text-[10.5px]">
                  <span className="text-black/50 uppercase tracking-wider">ARRIVAL SPEC:</span>
                  <span className="text-emerald-700 font-bold">
                    {selectedFruit.qualityGuide.firmnessSpec}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Mobile Phase 3 Card: Single clean docked card with segmented tabs */}
          <div
            className="sm:hidden fixed bottom-5 inset-x-4 z-30 pointer-events-auto transition-opacity duration-300 select-none"
            style={{
              opacity: phase3Opacity,
              pointerEvents: phase3Opacity > 0.2 ? 'auto' : 'none',
            }}
          >
            <div className="bg-white/92 backdrop-blur-xl border border-black/10 rounded-2xl p-4 shadow-xl">
              {/* Segmented Tab Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-black/[0.04] rounded-xl border border-black/5 mb-3">
                <button
                  type="button"
                  onClick={() => setMobilePhase3Tab('varieties')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-center font-mono text-[9.5px] uppercase tracking-wider transition-all ${
                    mobilePhase3Tab === 'varieties'
                      ? 'bg-white shadow-sm font-bold text-[#1A1A1A]'
                      : 'text-black/50 hover:text-black/80'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    03 // Varieties
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobilePhase3Tab('specs')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-center font-mono text-[9.5px] uppercase tracking-wider transition-all ${
                    mobilePhase3Tab === 'specs'
                      ? 'bg-white shadow-sm font-bold text-[#1A1A1A]'
                      : 'text-black/50 hover:text-black/80'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    07 // Specs
                  </span>
                </button>
              </div>

              {/* Tab 1: Varieties */}
              {mobilePhase3Tab === 'varieties' ? (
                <div className="space-y-2 text-left animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-[#1A1A1A] leading-snug">
                      Commercial Import Catalogue
                    </h3>
                    <span className="font-mono text-[9px] text-black/50 uppercase">
                      {selectedFruit.varieties.length} Cultivars
                    </span>
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    {selectedFruit.varieties.slice(0, 3).map((v) => (
                      <div key={v.id} className="border-b border-black/10 pb-1 font-mono text-[10.5px]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#1A1A1A] tracking-tight">{v.name}</span>
                          <span className="text-[#8e1d24] font-medium text-[9.5px] whitespace-nowrap">{v.seasonWindow}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-black/60 text-[9.5px] mt-0.5">
                          <span className="truncate pr-1">{v.tasteProfile ? v.tasteProfile.split(',')[0] : v.notes.split('.')[0]}</span>
                          <span className="font-bold text-black/85 whitespace-nowrap px-1 py-0.2 rounded bg-black/[0.04] text-[9px]">
                            {v.brix}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Tab 2: Specs & Logistics */
                <div className="space-y-2 text-left animate-in fade-in duration-200">
                  <h3 className="font-serif text-lg text-[#1A1A1A] leading-snug">
                    Export Calibers & Cold Chain
                  </h3>
                  <div className="space-y-1.5 font-mono text-[10.5px] text-black/75 pt-0.5">
                    <div className="flex items-baseline justify-between border-b border-black/10 pb-1 gap-2">
                      <span className="text-black/40 uppercase text-[9px] tracking-wider shrink-0">COUNT SIZES:</span>
                      <span className="text-[#1A1A1A] font-semibold text-right truncate">
                        {selectedFruit.packingSpecs.counts.slice(0, 5).join(', ')}...
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-black/10 pb-1 gap-2">
                      <span className="text-black/40 uppercase text-[9px] tracking-wider shrink-0">FORMATS:</span>
                      <span className="text-[#1A1A1A] text-right truncate text-[10px]">
                        {selectedFruit.packingSpecs.formats.map((f) => f.name).join(' • ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-black/10 pb-1 gap-2">
                      <div>
                        <span className="text-black/40 uppercase text-[8.5px] tracking-wider block">COLD TEMP</span>
                        <span className="text-[#1A1A1A] font-medium text-[10px]">
                          {selectedFruit.qualityGuide.coldChainTemp.split('(')[0]}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-black/40 uppercase text-[8.5px] tracking-wider block">ARRIVAL SPEC</span>
                        <span className="text-emerald-700 font-bold text-[10px]">
                          {selectedFruit.qualityGuide.firmnessSpec}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================================= */}
          {/* PHASE 4: SLICED FRUIT ANATOMY & INTERNAL QUALITY (~76% - 98% scrub)     */}
          {/* ======================================================================= */}
          <AnatomyOverlay
            selectedFruit={selectedFruit}
            scrollProgress={scrubProgress}
            onOpenPartnership={() => setIsPartnershipOpen(true)}
            onSelectNextFruit={handleSelectNextFruit}
          />
        </div>

        {/* ========================================================================= */}
        {/* STAGE 2: COMPLETE 9-PART MASTER COMMERCIAL DOSSIER (Slides 01 - 05) */}
        {/* ========================================================================= */}
        <div className="relative z-20 bg-gradient-to-b from-transparent via-[#fefef7] to-[#fbfbf2] pt-8">
          <CommercialDossier
            selectedFruit={selectedFruit}
            isDarkMode={isDarkMode}
          />
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MOBILE STICKY BOTTOM ACTION PILL (Commercial Dossier only) */}
      {/* ========================================================================= */}
      <div
        className={`fixed bottom-4 left-4 right-4 z-40 sm:hidden flex items-center justify-between p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-black/15 shadow-2xl transition-all duration-500 ease-out ${
          getScrubTrackHeight() > 0 && scrollY > getScrubTrackHeight() + 30
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-12 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2.5 pl-1">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          <div className="flex flex-col">
            <span className="font-serif text-sm font-medium text-[#1A1A1A] leading-tight">
              {selectedFruit.name}
            </span>
            <span className="font-mono text-[9px] text-emerald-700 font-bold uppercase">
              ● In Season Now
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('section-enquire');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2.5 rounded-xl text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            style={{ backgroundColor: accentColor }}
          >
            <span>Enquire B2B</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* MINIMAL ALLOCATION INQUIRY MODAL */}
      <PartnershipModal
        isOpen={isPartnershipOpen}
        onClose={() => setIsPartnershipOpen(false)}
        selectedFruit={selectedFruit}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
