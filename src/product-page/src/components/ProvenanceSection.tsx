import React from 'react';
import { FruitSpecimen } from '../types';
import { motion } from 'motion/react';
import { Sparkles, Compass, Thermometer, CloudRain, Sun } from 'lucide-react';

interface ProvenanceSectionProps {
  selectedFruit: FruitSpecimen;
}

export function ProvenanceSection({ selectedFruit }: ProvenanceSectionProps) {
  const isApple = selectedFruit.id === 'apple';

  return (
    <section id="provenance-section" className="relative px-2 sm:px-6 md:px-8 py-12 sm:py-24">
      <div className="w-full space-y-12">
        
        {/* Extreme Left Flank 1: Micro-Climate & Soil Card */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className="max-w-xs sm:max-w-sm rounded-2xl border border-white/60 bg-white/40 shadow-xl p-4 sm:p-5 space-y-4 backdrop-blur-md mr-auto ml-0"
        >
          <div className="flex flex-col justify-between gap-2 pb-3 border-b border-black/10">
            <div>
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50 font-mono">
                [ GEOGRAPHIC ELEVATION ]
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-normal mt-0.5">
                {selectedFruit.origin} Terroir
              </h3>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-white text-[8px] font-mono font-bold uppercase tracking-wider self-start">
              <Compass className="w-2.5 h-2.5 text-emerald-400" />
              <span>{selectedFruit.elevation}</span>
            </div>
          </div>

          <p className="font-sans text-[11px] text-[#1A1A1A]/85 leading-relaxed">
            {isApple
              ? 'Nurtured on cold mountain ridges with freezing alpine night winds. High cellular density locks in crisp acoustic snap.'
              : 'Cultivated in rich volcanic basalt soils around Mount Etna. Mineral-rich irrigation creates rich anthocyanin vesiculation.'}
          </p>

          {/* Environmental Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2 rounded-lg border border-black/10 bg-white/30 space-y-0.5">
              <div className="text-[#1A1A1A]/50 text-[8px] font-bold uppercase">DELTA</div>
              <div className="font-mono text-xs font-bold text-[#1A1A1A]">{isApple ? '18.4°C' : '16.2°C'}</div>
            </div>

            <div className="p-2 rounded-lg border border-black/10 bg-white/30 space-y-0.5">
              <div className="text-[#1A1A1A]/50 text-[8px] font-bold uppercase">SOLAR</div>
              <div className="font-mono text-xs font-bold text-[#1A1A1A]">{isApple ? '2840h' : '3100h'}</div>
            </div>

            <div className="p-2 rounded-lg border border-black/10 bg-white/30 space-y-0.5">
              <div className="text-[#1A1A1A]/50 text-[8px] font-bold uppercase">WATER</div>
              <div className="font-mono text-[10px] font-bold text-[#1A1A1A] truncate">{isApple ? 'Glacial' : 'Volcanic'}</div>
            </div>
          </div>
        </motion.div>

        {/* Extreme Right Flank 2: Flavor Profile Radar Card */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className="max-w-xs sm:max-w-sm rounded-2xl border border-white/60 bg-white/40 shadow-xl p-4 sm:p-5 space-y-4 backdrop-blur-md ml-auto mr-0 mt-8 sm:mt-16"
        >
          <div className="pb-3 border-b border-black/10">
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/50 font-mono">
              [ SENSORY ARCHITECTURE ]
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-normal mt-0.5">
              Flavor & Texture Analytics
            </h3>
          </div>

          {/* Flavor Bar Meters */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between font-sans text-[10px] font-bold text-[#1A1A1A] mb-1">
                <span>SWEETNESS (BRIX)</span>
                <span className="font-mono">{selectedFruit.flavorProfile.sweetness}%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-black/10 overflow-hidden">
                <div
                  className="h-full bg-[#1A1A1A]"
                  style={{ width: `${selectedFruit.flavorProfile.sweetness}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-sans text-[10px] font-bold text-[#1A1A1A] mb-1">
                <span>AROMATIC VOLATILES</span>
                <span className="font-mono">{selectedFruit.flavorProfile.aroma}%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-black/10 overflow-hidden">
                <div
                  className="h-full bg-[#1A1A1A]"
                  style={{ width: `${selectedFruit.flavorProfile.aroma}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-sans text-[10px] font-bold text-[#1A1A1A] mb-1">
                <span>TARTNESS & MALIC</span>
                <span className="font-mono">{selectedFruit.flavorProfile.tartness}%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-black/10 overflow-hidden">
                <div
                  className="h-full bg-[#1A1A1A]"
                  style={{ width: `${selectedFruit.flavorProfile.tartness}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-sans text-[10px] font-bold text-[#1A1A1A] mb-1">
                <span>ACOUSTIC CRISPNESS</span>
                <span className="font-mono">{selectedFruit.flavorProfile.crispness}%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-black/10 overflow-hidden">
                <div
                  className="h-full bg-[#1A1A1A]"
                  style={{ width: `${selectedFruit.flavorProfile.crispness}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
