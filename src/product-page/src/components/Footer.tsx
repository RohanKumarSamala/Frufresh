import React from 'react';
import { FrufreshLogo } from './FrufreshLogo';

interface FooterProps {
  onOpenPartnership: () => void;
}

export function Footer({ onOpenPartnership }: FooterProps) {
  return (
    <footer id="editorial-footer" className="relative border-t border-[#E5E5E1] px-6 sm:px-12 md:px-16 lg:px-20 py-8 text-[#1A1A1A] bg-white/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-[#1A1A1A]/50">
      <div className="flex items-center gap-3 text-[#1A1A1A]">
        <FrufreshLogo size="sm" />
        <span className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest ml-1">• Cascade & Etna Cultivars</span>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-[11px] font-mono">LAT 47.38° N • LON 0.68° E</span>
        <button
          onClick={onOpenPartnership}
          className="text-[#1A1A1A] font-bold uppercase tracking-wider hover:underline"
        >
          Inquire
        </button>
      </div>
    </footer>
  );
}


