import React from 'react';
import { PearLogoIcon, DiamondCrosshair } from './Icons';

interface SidebarRailProps {
  onToggleMenu: () => void;
  isMenuOpen: boolean;
  activeSection?: string;
  onSelectFruit?: (fruitId: string) => void;
}

export function SidebarRail({ }: SidebarRailProps) {
  return (
    <aside
      id="architectural-sidebar-rail"
      className="fixed top-0 left-0 bottom-0 z-40 w-14 sm:w-16 border-r border-[#E5E5E1] bg-[#FCFCFA]/90 backdrop-blur-md flex flex-col justify-between items-center py-5 select-none pointer-events-auto"
    >
      {/* Top Logo */}
      <a
        href="#top"
        id="sidebar-logo-link"
        className="text-[#1A1A1A] hover:opacity-60 transition-opacity p-2"
        aria-label="Natura home"
      >
        <PearLogoIcon className="w-5 h-6 text-[#1A1A1A]" />
      </a>

      {/* Middle Vertical Coordinate text */}
      <div className="font-sans text-[8px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/30 rotate-180 [writing-mode:vertical-rl]">
        NATURA • ARCHIVE
      </div>

      {/* Bottom Index */}
      <div className="font-sans text-[9px] font-bold text-[#1A1A1A]/40">
        № 01
      </div>
    </aside>
  );
}

// Minimal Diamond Crosshair at Grid Intersection
export function GridStarIntersection({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[#1A1A1A] pointer-events-none ${className}`}>
      <DiamondCrosshair className="w-3.5 h-3.5" />
    </div>
  );
}


