import React from 'react';
import { FruitSpecimen } from '../types';
import { ThemeButton } from './ThemeButton';
import { motion } from 'motion/react';

interface FruitSpecimensProps {
  fruits: FruitSpecimen[];
  selectedFruit: FruitSpecimen;
  onSelectFruit: (fruit: FruitSpecimen) => void;
  onReserve: (fruit: FruitSpecimen) => void;
}

export function FruitSpecimens({
  fruits,
  selectedFruit,
  onSelectFruit,
  onReserve
}: FruitSpecimensProps) {
  return (
    <section id="specimens-section" className="relative px-4 sm:px-8 md:px-12 py-16 sm:py-24 max-w-6xl mx-auto">
      {/* Micro header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/60 max-w-lg">
        <div className="flex items-center gap-2">
          <span className="w-4 h-px bg-[#1A1A1A]"></span>
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#1A1A1A]">
            CURATED CULTIVARS
          </span>
        </div>
        <span className="font-sans text-[10px] text-[#1A1A1A]/60 uppercase tracking-widest font-mono">
          2 AVAILABLE
        </span>
      </div>

      {/* 2-column comparative cards positioned on flanks with clear central corridor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        {fruits.map((fruit, idx) => {
          const isSelected = fruit.id === selectedFruit.id;
          return (
            <motion.div
              key={fruit.id}
              id={`specimen-card-${fruit.id}`}
              onClick={() => onSelectFruit(fruit)}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className={`cursor-pointer rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                isSelected
                  ? 'glass-card-luxury ring-2 ring-[#1A1A1A]/20'
                  : 'glass-card-subtle hover:glass-card-luxury'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/60 font-sans text-xs font-bold text-[#1A1A1A]/60">
                  <span>№ 0{idx + 1}</span>
                  <span className="uppercase tracking-wider font-mono">{fruit.origin}</span>
                </div>

                <div className="pt-4 space-y-1.5">
                  <div className="text-[8px] uppercase tracking-[0.25em] font-bold text-[#B87333]">
                    VINTAGE RESERVE
                  </div>
                  <h3
                    className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal"
                    style={{ fontFamily: 'var(--fr-serif)' }}
                  >
                    {fruit.name}
                  </h3>
                  <p className="mt-2 font-sans text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed font-normal">
                    {fruit.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3 font-sans text-xs text-[#1A1A1A]/70 font-mono">
                  <span className="px-2.5 py-0.5 rounded-full glass-pill-luxury">{fruit.brixLevel}° Bx</span>
                  <span>•</span>
                  <span>{fruit.harvestWindow}</span>
                  <span>•</span>
                  <span>{fruit.elevation}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/60 flex items-center justify-between">
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/60">
                  {isSelected ? 'SELECTED CULTIVAR' : 'SELECT CULTIVAR'}
                </span>

                <ThemeButton
                  id={`reserve-specimen-${fruit.id}-btn`}
                  variant="primary-split"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReserve(fruit);
                  }}
                >
                  ALLOCATE
                </ThemeButton>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}


