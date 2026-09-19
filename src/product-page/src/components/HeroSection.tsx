import React from 'react';
import { FruitSpecimen } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSectionProps {
  selectedFruit: FruitSpecimen;
  onOpenPartnership: () => void;
  onSelectNextFruit: () => void;
  onNavigateStage?: (stage: number) => void;
  isDarkMode?: boolean;
}

export function HeroSection({ selectedFruit, onNavigateStage }: HeroSectionProps) {
  const isApple = selectedFruit.id === 'apple';
  const isOrange = selectedFruit.id === 'orange';
  const accentColor = isApple ? '#8e1d24' : isOrange ? '#c2410c' : '#be185d';

  const scrollToSection = (id: string) => {
    if (onNavigateStage) {
      if (id === 'section-origin' || id === 'section-taste') {
        onNavigateStage(1);
        return;
      }
      if (id === 'section-varieties' || id === 'section-packing') {
        onNavigateStage(2);
        return;
      }
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-section"
      className="relative flex flex-col justify-between lg:justify-center pt-14 lg:pt-24 pb-6 lg:pb-12 min-h-[calc(100dvh-60px)] lg:min-h-[90vh] sm:lg:min-h-[92vh]"
    >
      {/* ================================================================ */}
      {/* DESKTOP HERO (lg and up) — 100% UNTOUCHED ORIGINAL LAYOUT        */}
      {/* ================================================================ */}
      <div className="hidden lg:grid w-full grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* LEFT — the specimen copy */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="fr-hero-copy space-y-6 select-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFruit.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                  <p className="fr-label fr-label--accent !mb-0 font-mono tracking-widest text-[10px] uppercase font-bold">
                    {selectedFruit.tagline}
                  </p>
                </div>

                <h1 className="fr-display !text-3xl sm:!text-5xl lg:!text-6xl font-serif text-[#1A1A1A] leading-[1.08] tracking-tight">
                  {selectedFruit.heroHeadline}
                </h1>

                <p className="fr-body !text-xs sm:!text-sm text-[#1A1A1A]/80 leading-relaxed font-sans">
                  {selectedFruit.heroSubheadline}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* One call to action. The varieties button next to this one
                only scrolled down the page, which the page already invites
                by being scrollable — it competed with the enquiry for
                attention while leading somewhere the reader would reach
                anyway. */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('section-enquire')}
                className="fr-btn fr-btn--primary justify-center sm:justify-start !py-3.5 !px-6 text-center cursor-pointer shadow-sm hover:shadow-md transition-all font-mono"
              >
                <span>B2B Sourcing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MOBILE HERO (below lg) — FRAMED TOP CROWN & BOTTOM ANCHOR        */}
      {/* ================================================================ */}
      <div className="lg:hidden flex flex-col justify-between flex-1 w-full select-none">
        {/* 1. TOP CROWN (Above the Fruit) */}
        <div className="pt-2 sm:pt-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFruit.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 max-w-sm mx-auto"
            >
              {/* Eyebrow badge */}
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-black/10 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                <p className="fr-label fr-label--accent !mb-0 font-mono tracking-widest text-[9.5px] uppercase font-bold text-black/80">
                  {selectedFruit.tagline}
                </p>
              </div>

              {/* Editorial Headline */}
              <h1 className="font-serif text-[27px] sm:text-3xl text-[#1A1A1A] leading-[1.12] tracking-tight font-medium px-2">
                {selectedFruit.heroHeadline}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 2. CENTER WINDOW (Dedicated 100% Unobstructed 3D Fruit Stage) */}
        <div className="flex-1 min-h-[250px] sm:min-h-[290px] pointer-events-none" aria-hidden="true" />

        {/* 3. BOTTOM ANCHOR (Below the Fruit: Subheadline & Thumb-Friendly CTAs) */}
        <div className="w-full max-w-sm mx-auto pb-4 sm:pb-6 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFruit.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-center px-3"
            >
              <p className="text-xs text-black/75 leading-relaxed font-sans">
                {selectedFruit.heroSubheadline}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action CTA. Takes the filled treatment the varieties button
              used to hold: it is the only one here now, and left as the
              outline style it would have read as the secondary of a pair
              that no longer exists. */}
          <div className="flex flex-col gap-2.5 w-full px-2">
            <button
              type="button"
              onClick={() => scrollToSection('section-enquire')}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 text-center font-mono text-[10.5px] tracking-widest uppercase font-bold text-white shadow-md active:scale-[0.98] transition-all cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              <span>B2B Sourcing</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
