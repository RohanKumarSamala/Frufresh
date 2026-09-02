import React, { useState } from 'react';
import { FruitSpecimen } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Minus, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { FrufreshLogo } from '../components/FrufreshLogo';

interface HomePageProps {
  fruits: FruitSpecimen[];
  onSelectFruit: (fruitId: string) => void;
  onOpenPartnership: (fruit?: FruitSpecimen) => void;
}

export function HomePage({ fruits, onSelectFruit, onOpenPartnership }: HomePageProps) {
  const [selectedFruitId, setSelectedFruitId] = useState<'apple' | 'orange'>('apple');
  const [quantity, setQuantity] = useState(1);

  const selectedFruit = fruits.find((f) => f.id === selectedFruitId) || fruits[0];
  const isApple = selectedFruitId === 'apple';

  const price = isApple ? 4.99 : 5.49;
  const loopVideoUrl = isApple ? '/products-assets/video/apple-loop.mp4' : '/products-assets/video/oranges-loop.mp4';
  const leafColor = '#88C040';

  return (
    <div
      id="home-page-container"
      className="relative min-h-[92vh] sm:min-h-screen w-full text-white selection:bg-white selection:text-black overflow-hidden flex items-center px-4 sm:px-8 md:px-12 bg-black"
    >
      {/* PURE UN-TINTED FULL-SCREEN BACKGROUND VIDEO (Clickable Portal trigger!) */}
      <div
        onClick={() => onSelectFruit(selectedFruitId)}
        className="absolute inset-0 z-0 overflow-hidden cursor-pointer group"
      >
        <video
          key={loopVideoUrl}
          src={loopVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
        />

        {/* Subtle radial shadow vignette around edges for editorial depth */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.35)_90%)]" />
      </div>

      {/* MAIN CONTENT LAYER: Vertically Centered Left Panel */}
      <div className="relative z-10 flex items-center gap-6 sm:gap-10 my-auto">
        {/* Vertical Margin Text */}
        <div className="hidden sm:flex items-center gap-3 rotate-180 [writing-mode:vertical-lr] text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white/70">
          <span className="w-8 h-px bg-white/40"></span>
          <span>— FRUFRESH BOTANICAL CULTIVARS —</span>
        </div>

        {/* SELECT A FRUIT Menu */}
        <div className="space-y-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-bold text-white/70 block">
            SELECT A FRUIT:
          </span>

          <div className="space-y-3 font-sans">
            {/* APPLE BUTTON */}
            <button
              id="home-select-apple-btn"
              onClick={() => setSelectedFruitId('apple')}
              className={`group text-left w-full flex items-center gap-3.5 transition-all duration-300 py-1.5 ${
                isApple
                  ? 'text-white font-bold text-xl sm:text-2xl translate-x-1'
                  : 'text-white/60 hover:text-white text-lg sm:text-xl'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isApple ? 'bg-white scale-125' : 'bg-transparent border border-white/50 opacity-50'
                }`}
              />
              <span className="uppercase tracking-wider font-sans">APPLE</span>
              {isApple && (
                <span className="ml-3 text-[9px] font-mono font-normal uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 border border-white/20">
                  15.8° BX
                </span>
              )}
            </button>

            {/* ORANGE BUTTON */}
            <button
              id="home-select-orange-btn"
              onClick={() => setSelectedFruitId('orange')}
              className={`group text-left w-full flex items-center gap-3.5 transition-all duration-300 py-1.5 ${
                !isApple
                  ? 'text-white font-bold text-xl sm:text-2xl translate-x-1'
                  : 'text-white/60 hover:text-white text-lg sm:text-xl'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  !isApple ? 'bg-white scale-125' : 'bg-transparent border border-white/50 opacity-50'
                }`}
              />
              <span className="uppercase tracking-wider font-sans">ORANGE</span>
              {!isApple && (
                <span className="ml-3 text-[9px] font-mono font-normal uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 border border-white/20">
                  16.5° BX
                </span>
              )}
            </button>
          </div>

          {/* Sub-Tagline & Origin Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFruitId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="pt-5 border-t border-white/15 max-w-sm space-y-2"
            >
              <div className="font-mono text-[9px] uppercase tracking-wider text-white/60">
                ORIGIN: {selectedFruit.origin.toUpperCase()} • {selectedFruit.elevation}
              </div>
              <p className="font-sans text-xs sm:text-sm text-white/85 leading-relaxed font-normal">
                {selectedFruit.heroSubheadline}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* INTEGRATED 3D EXPERIENCE TRIGGER BUTTON */}
          <div className="pt-2">
            <button
              id="home-left-enter-3d-btn"
              onClick={() => onSelectFruit(selectedFruitId)}
              className="px-7 py-4 rounded-full font-sans text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-white/90 transition-all shadow-2xl flex items-center gap-3 group"
            >
              <span>EXPLORE 3D SCROLL</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
