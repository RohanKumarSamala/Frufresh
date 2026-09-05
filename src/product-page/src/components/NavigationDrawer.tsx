import React from 'react';
import { FruitSpecimen } from '../types';
import { ThemeBadge, ThemeButton } from './ThemeButton';
import { X, ArrowRight, Compass, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fruits: FruitSpecimen[];
  selectedFruit: FruitSpecimen;
  onSelectFruit: (fruit: FruitSpecimen) => void;
  onOpenPartnership: () => void;
  onOpenThemeSandbox: () => void;
}

export function NavigationDrawer({
  isOpen,
  onClose,
  fruits,
  selectedFruit,
  onSelectFruit,
  onOpenPartnership,
  onOpenThemeSandbox
}: NavigationDrawerProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Drawer panel in Clean Minimalism */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative z-10 w-full max-w-sm bg-[#FCFCFA] border-r border-[#E5E5E1] h-full p-4 sm:p-6 flex flex-col justify-between overflow-y-auto text-[#1A1A1A] shadow-xl"
        >
          <div>
            {/* Top drawer header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E1]">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-4 h-px bg-[#1A1A1A]"></span>
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                    BOTANICAL DIRECTORY
                  </span>
                </div>
                <h3 className="font-serif text-xl font-normal text-[#1A1A1A]">Cultivar Index</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full border border-[#E5E5E1] bg-white hover:bg-[#F4F4F0] text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors"
                aria-label="Close directory"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Specimen listing */}
            <div className="mt-5">
              <span className="font-sans text-[9px] uppercase font-bold tracking-wider text-[#1A1A1A]/50 block mb-3">
                [ APPLES & ORANGES ]
              </span>
              <div className="space-y-1.5">
                {fruits.map((fruit, idx) => {
                  const isSelected = fruit.id === selectedFruit.id;
                  return (
                    <button
                      key={fruit.id}
                      onClick={() => {
                        onSelectFruit(fruit);
                        onClose();
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-xs'
                          : 'border-[#E5E5E1] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]/50 hover:bg-[#F4F4F0]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-sans text-[9px] font-bold ${isSelected ? 'text-white/60' : 'text-[#1A1A1A]/40'}`}>
                            0{idx + 1}
                          </span>
                          <span className={`font-serif text-base font-normal ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                            {fruit.name}
                          </span>
                        </div>
                        <span className={`font-sans text-[9px] block mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#1A1A1A]/50'}`}>
                          {fruit.botanicalName} • {fruit.brixLevel}° Bx
                        </span>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-white' : 'text-[#1A1A1A]/30'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick links & tools */}
            <div className="mt-6 pt-4 border-t border-[#E5E5E1] space-y-2">
              <span className="font-sans text-[9px] uppercase font-bold tracking-wider text-[#1A1A1A]/50 block mb-1.5">
                [ DESIGN & PROTOCOLS ]
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenThemeSandbox();
                }}
                className="w-full text-left p-3 rounded-xl border border-[#E5E5E1] bg-[#F4F4F0] hover:bg-white hover:border-[#1A1A1A] flex items-center justify-between font-sans text-[11px] font-bold text-[#1A1A1A] transition-all"
              >
                <span>OPEN THEME LAB & BUTTON SPEC</span>
                <span className="text-[9px] uppercase font-bold text-[#1A2F23]">[THEME LAB]</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenPartnership();
                }}
                className="w-full text-left p-3 rounded-xl border border-[#E5E5E1] bg-[#F4F4F0] hover:bg-white hover:border-[#1A1A1A] flex items-center justify-between font-sans text-[11px] font-bold text-[#1A1A1A] transition-all"
              >
                <span>REQUEST ALLOCATION</span>
                <ArrowRight className="w-3 h-3 text-[#1A1A1A]/60" />
              </button>
            </div>
          </div>

          {/* Drawer footer */}
          <div className="pt-4 border-t border-[#E5E5E1] font-sans text-[9px] font-bold text-[#1A1A1A]/40 flex items-center justify-between">
            <span>NATURA BOTANICALS</span>
            <span>LIMITED ALLOCATION</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

