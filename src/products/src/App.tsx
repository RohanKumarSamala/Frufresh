import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FRUIT_SPECIMENS } from './data/fruits';
import { FruitSpecimen } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PartnershipModal } from './components/PartnershipModal';
import { ScrollFrameBackground, FRAME_COUNTS, INTRO_FRACTION } from './components/ScrollFrameBackground';
import { GuideGrid } from './components/GuideGrid';
import { RailNav } from './components/RailNav';
import { AnatomyOverlay } from './components/AnatomyOverlay';

const SNAP_POINTS = [0, 0.32, 0.62, 1.0];

export default function App() {
  // Links from the home page arrive as /products/?fruit=orange, so the
  // page opens on the cultivar that was asked for.
  const initialFruit =
    FRUIT_SPECIMENS.find(
      (f) => f.id === new URLSearchParams(window.location.search).get('fruit')
    ) || FRUIT_SPECIMENS[0];

  const [fruits] = useState<FruitSpecimen[]>(FRUIT_SPECIMENS);
  const [selectedFruit, setSelectedFruit] = useState<FruitSpecimen>(initialFruit);
  const [activeView, setActiveView] = useState<'apple' | 'orange'>(
    initialFruit.id as 'apple' | 'orange'
  );
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [, setScrollY] = useState(0);

  const isAnimatingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const isLockedRef = useRef(false);
  const touchStartYRef = useRef(0);

  const getDocHeight = useCallback(() => {
    return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }, []);

  const scrollToStage = useCallback((stageIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(SNAP_POINTS.length - 1, stageIndex));
    const docHeight = getDocHeight();
    const targetY = Math.round(SNAP_POINTS[clampedIndex] * docHeight);
    const startY = window.scrollY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) {
      return;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    isAnimatingRef.current = true;
    isLockedRef.current = true;

    const startTime = performance.now();
    const duration = 750;

    // Smooth quartic ease-out for liquid deceleration
    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        isAnimatingRef.current = false;
        setTimeout(() => {
          isLockedRef.current = false;
        }, 150);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, [getDocHeight]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);
      const docHeight = getDocHeight();
      if (docHeight > 0) {
        setScrollProgress(Math.max(0, Math.min(1, currentY / docHeight)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [getDocHeight]);

  // Stepped autoscroll gesture interception (Wheel, Touch, Keyboard)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isPartnershipOpen) return;

      e.preventDefault();

      if (isLockedRef.current || isAnimatingRef.current) return;
      if (Math.abs(e.deltaY) < 12) return;

      const docHeight = getDocHeight();
      if (docHeight <= 0) return;

      const currentProgress = window.scrollY / docHeight;

      if (e.deltaY > 0) {
        // Next chapter down
        const nextIdx = SNAP_POINTS.findIndex((p) => p > currentProgress + 0.05);
        if (nextIdx !== -1) {
          scrollToStage(nextIdx);
        } else {
          scrollToStage(SNAP_POINTS.length - 1);
        }
      } else {
        // Prev chapter up
        let prevIdx = -1;
        for (let i = SNAP_POINTS.length - 1; i >= 0; i--) {
          if (SNAP_POINTS[i] < currentProgress - 0.05) {
            prevIdx = i;
            break;
          }
        }
        if (prevIdx !== -1) {
          scrollToStage(prevIdx);
        } else {
          scrollToStage(0);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isPartnershipOpen) return;
      if (isLockedRef.current || isAnimatingRef.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isPartnershipOpen) return;
      if (isLockedRef.current || isAnimatingRef.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartYRef.current - touchEndY; // positive = swipe up = scroll down

      if (Math.abs(diffY) < 35) return;

      const docHeight = getDocHeight();
      if (docHeight <= 0) return;

      const currentProgress = window.scrollY / docHeight;

      if (diffY > 0) {
        const nextIdx = SNAP_POINTS.findIndex((p) => p > currentProgress + 0.05);
        if (nextIdx !== -1) {
          scrollToStage(nextIdx);
        } else {
          scrollToStage(SNAP_POINTS.length - 1);
        }
      } else {
        let prevIdx = -1;
        for (let i = SNAP_POINTS.length - 1; i >= 0; i--) {
          if (SNAP_POINTS[i] < currentProgress - 0.05) {
            prevIdx = i;
            break;
          }
        }
        if (prevIdx !== -1) {
          scrollToStage(prevIdx);
        } else {
          scrollToStage(0);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPartnershipOpen) return;
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        const docHeight = getDocHeight();
        const currentProgress = window.scrollY / docHeight;
        const nextIdx = SNAP_POINTS.findIndex((p) => p > currentProgress + 0.05);
        if (nextIdx !== -1) scrollToStage(nextIdx);
        else scrollToStage(SNAP_POINTS.length - 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        const docHeight = getDocHeight();
        const currentProgress = window.scrollY / docHeight;
        let prevIdx = -1;
        for (let i = SNAP_POINTS.length - 1; i >= 0; i--) {
          if (SNAP_POINTS[i] < currentProgress - 0.05) {
            prevIdx = i;
            break;
          }
        }
        if (prevIdx !== -1) scrollToStage(prevIdx);
        else scrollToStage(0);
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
    };
  }, [isPartnershipOpen, getDocHeight, scrollToStage]);

  const handleSelectView = (view: 'apple' | 'orange') => {
    setActiveView(view);
    if (view === 'apple') {
      const apple = fruits.find(f => f.id === 'apple') || fruits[0];
      setSelectedFruit(apple);
    } else if (view === 'orange') {
      const orange = fruits.find(f => f.id === 'orange') || fruits[1];
      setSelectedFruit(orange);
    }
    scrollToStage(0);
  };

  const handleSelectNextFruit = () => {
    const currentIndex = fruits.findIndex(f => f.id === selectedFruit.id);
    const nextIndex = (currentIndex + 1) % fruits.length;
    const nextFruit = fruits[nextIndex];
    setSelectedFruit(nextFruit);
    setActiveView(nextFruit.id as 'apple' | 'orange');
    scrollToStage(0);
  };

  // When scrolling past top (progress > 0.12), hide hero drawer to reveal 100% pure rotating fruit
  const isPureFruitPhase = scrollProgress > 0.12;

  // Viewport-heights of scroll per frame.
  const VH_PER_FRAME = 3.4;
  const frames =
    FRAME_COUNTS[selectedFruit.id as keyof typeof FRAME_COUNTS] ??
    FRAME_COUNTS.apple;
  const trackVh = (frames * VH_PER_FRAME) / (1 - INTRO_FRACTION);

  const isApple = selectedFruit.id === 'apple';
  const isDarkMode = false;

  return (
    <div
      id="fruit-website-root"
      className={`min-h-screen relative flex flex-col justify-between overflow-x-hidden transition-colors duration-700 ease-in-out ${
        isDarkMode
          ? 'bg-[#08080A] text-white selection:bg-white selection:text-black'
          : 'bg-[#fefef7] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-white'
      }`}
    >
      {/* Scroll-Driven Video Frame Background with Looping Hero Video */}
      <ScrollFrameBackground fruitId={selectedFruit.id} isDarkMode={isDarkMode} />

      {/* Guide grid, matching the home page: rests wide, draws in on scroll */}
      <GuideGrid />

      {/* Left-rail navigation, mirroring the home page */}
      <RailNav activeView={activeView} onSelectView={handleSelectView} />

      {/* Top Architectural Header */}
      <Header
        fruits={fruits}
        selectedFruit={selectedFruit}
        activeView={activeView}
        onSelectView={handleSelectView}
        onOpenPartnership={() => setIsPartnershipOpen(true)}
        isDarkMode={isDarkMode}
      />

      {/* Main content. Scroll distance is derived from the frame count above. */}
      <main
        className="px-4 sm:px-8 md:px-12 relative z-10 flex-1 flex flex-col justify-between"
        style={{ minHeight: `${trackVh}vh` }}
      >
        {/* Top Hero Section (Stage 0: 0% Scroll) */}
        <div className={`transition-all duration-500 ${isPureFruitPhase ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <HeroSection
            selectedFruit={selectedFruit}
            onOpenPartnership={() => setIsPartnershipOpen(true)}
            onSelectNextFruit={handleSelectNextFruit}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* CHAPTER 1: Terroir & Micro-climate (Stage 1: ~32% Scroll) */}
        <div
          className={`fr-clear-left fixed top-1/2 -translate-y-1/2 max-w-sm sm:max-w-md z-20 pointer-events-auto transition-all duration-700 ${
            scrollProgress >= 0.18 && scrollProgress <= 0.46
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-12 pointer-events-none'
          }`}
        >
          <div className="space-y-5 select-none">
            <h3 className="fr-heading">
              {isApple
                ? 'Glacial snowmelt & high-altitude diurnal winds.'
                : 'Mount Etna mineral ash & Mediterranean sun.'}
            </h3>

            <p className="fr-body">{selectedFruit.description}</p>
          </div>
        </div>

        {/* CHAPTER 2: Gastronomy & Sommelier Pairings (Stage 2: ~62% Scroll) */}
        <div
          className={`fixed top-1/2 -translate-y-1/2 right-4 sm:right-12 max-w-sm sm:max-w-md z-20 pointer-events-auto transition-all duration-700 ${
            scrollProgress >= 0.48 && scrollProgress <= 0.76
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-12 pointer-events-none'
          }`}
        >
          <div className="space-y-5 select-none">
            <h3 className="fr-heading">
              {isApple
                ? 'Aged Comté, Salted Tart Tatin & Blanc de Blancs.'
                : 'Seared Duck Breast, 74% Dark Chocolate & Nero d’Avola.'}
            </h3>
            <p className="fr-body">
              {isApple
                ? 'The dense cell structure and malic acidity cut cleanly through aged mountain cheeses and caramelized pastry.'
                : 'Intense raspberry anthocyanins and citrus oils harmonize with game meats and rich single-origin chocolates.'}
            </p>

          </div>
        </div>

        {/* CHAPTER 3: Anatomy of Crispness / Internal Quality Revealed (Stage 3: 100% Scroll) */}
        <AnatomyOverlay
          selectedFruit={selectedFruit}
          scrollProgress={scrollProgress}
          onOpenPartnership={() => setIsPartnershipOpen(true)}
          onSelectNextFruit={handleSelectNextFruit}
        />
      </main>

      {/* Minimal Allocation Inquiry Modal */}
      <PartnershipModal
        isOpen={isPartnershipOpen}
        onClose={() => setIsPartnershipOpen(false)}
        selectedFruit={selectedFruit}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}



