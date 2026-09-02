import React, { useState } from 'react';
import { ThemeButton, ThemeBadge } from './ThemeButton';
import { X, Copy, Check, Sparkles, Layers, Sliders, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ThemeSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeSandboxModal({ isOpen, onClose }: ThemeSandboxModalProps) {
  const [customText, setCustomText] = useState('REQUEST ALLOCATION');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [btnSize, setBtnSize] = useState<'sm' | 'md' | 'lg'>('sm');
  const [iconType, setIconType] = useState<'arrow-right' | 'arrow-diagonal' | 'none'>('arrow-right');

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border border-[#E5E5E1] bg-[#FCFCFA] p-5 sm:p-7 text-[#1A1A1A] shadow-xl"
        >
          {/* Top header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E1]">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-4 h-px bg-[#1A1A1A]"></span>
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                  DESIGN SYSTEM SPECIFICATION
                </span>
                <span className="font-sans text-[10px] text-[#1A1A1A]/40 ml-1.5">THEME LAB</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1A1A1A]">
                Clean Minimalism Theme Architecture
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-[#E5E5E1] bg-white text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#F4F4F0] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Playground Control Bar */}
          <div className="mt-5 p-4 rounded-xl border border-[#E5E5E1] bg-[#F4F4F0] space-y-3">
            <h3 className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]/70">
              [ LIVE COMPONENT CONTROLLER ]
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-sans text-[9px] font-bold uppercase text-[#1A1A1A]/60 mb-1">BUTTON LABEL</label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full rounded-full bg-white border border-[#E5E5E1] px-3 py-1.5 font-sans text-xs uppercase font-bold text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
                  placeholder="BUTTON TEXT..."
                />
              </div>

              <div>
                <label className="block font-sans text-[9px] font-bold uppercase text-[#1A1A1A]/60 mb-1">SIZE VARIANT</label>
                <div className="flex rounded-full border border-[#E5E5E1] bg-white p-0.5 overflow-hidden font-sans text-xs">
                  {(['sm', 'md', 'lg'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setBtnSize(s)}
                      className={`flex-1 py-1 rounded-full uppercase font-bold text-[9px] transition-all ${
                        btnSize === s ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-sans text-[9px] font-bold uppercase text-[#1A1A1A]/60 mb-1">ICON ATTACHMENT</label>
                <div className="flex rounded-full border border-[#E5E5E1] bg-white p-0.5 overflow-hidden font-sans text-xs">
                  {(['arrow-right', 'arrow-diagonal', 'none'] as const).map((it) => (
                    <button
                      key={it}
                      onClick={() => setIconType(it)}
                      className={`flex-1 py-1 rounded-full uppercase font-bold text-[9px] transition-all ${
                        iconType === it ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                      }`}
                    >
                      {it === 'arrow-right' ? '→' : it === 'arrow-diagonal' ? '↗' : 'NONE'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Theme Variants Grid */}
          <div className="mt-5 space-y-4">
            {/* 1. Signature Primary Split Button */}
            <div className="p-4 rounded-xl border border-[#E5E5E1] bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E5E1]">
                <div>
                  <span className="font-sans text-[9px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider">01 // SIGNATURE CTA</span>
                  <h4 className="font-serif text-base font-normal text-[#1A1A1A]">Primary Split Architectural Button</h4>
                  <p className="font-sans text-[11px] text-[#1A1A1A]/60">
                    Sleek #1A1A1A pill with tracked label, hairline vertical separator, and right arrow enclosure.
                  </p>
                </div>
                <ThemeButton
                  variant="primary-split"
                  size={btnSize}
                  iconType={iconType}
                >
                  {customText || 'REQUEST ALLOCATION'}
                </ThemeButton>
              </div>

              <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-[#1A1A1A]/50">
                <code>&lt;ThemeButton variant="primary-split"&gt;{customText}&lt;/ThemeButton&gt;</code>
                <button
                  onClick={() => copyCode(`<ThemeButton variant="primary-split">${customText}</ThemeButton>`, 1)}
                  className="inline-flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-wider hover:text-black"
                >
                  {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 1 ? 'COPIED' : 'COPY JSX'}</span>
                </button>
              </div>
            </div>

            {/* 2. Ghost Coordinate Bracket Button */}
            <div className="p-4 rounded-xl border border-[#E5E5E1] bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E5E1]">
                <div>
                  <span className="font-sans text-[9px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider">02 // GHOST PILL</span>
                  <h4 className="font-serif text-base font-normal text-[#1A1A1A]">Coordinate Bracket Button</h4>
                  <p className="font-sans text-[11px] text-[#1A1A1A]/60">
                    Clean hairline pill with bracket coordinate markers and subtle hover state.
                  </p>
                </div>
                <ThemeButton
                  variant="ghost-coordinate"
                  size="sm"
                  iconType={iconType}
                >
                  {customText || 'EXPLORE CULTIVARS'}
                </ThemeButton>
              </div>

              <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-[#1A1A1A]/50">
                <code>&lt;ThemeButton variant="ghost-coordinate"&gt;{customText}&lt;/ThemeButton&gt;</code>
                <button
                  onClick={() => copyCode(`<ThemeButton variant="ghost-coordinate">${customText}</ThemeButton>`, 2)}
                  className="inline-flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-wider hover:text-black"
                >
                  {copiedIndex === 2 ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 2 ? 'COPIED' : 'COPY JSX'}</span>
                </button>
              </div>
            </div>

            {/* 3. AT YOUR SERVICE Badge Pill */}
            <div className="p-4 rounded-xl border border-[#E5E5E1] bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E5E1]">
                <div>
                  <span className="font-sans text-[9px] font-bold text-[#1A1A1A]/50 uppercase tracking-wider">03 // STATUS BADGE</span>
                  <h4 className="font-serif text-base font-normal text-[#1A1A1A]">Clean Minimalist Badges</h4>
                  <p className="font-sans text-[11px] text-[#1A1A1A]/60">
                    Pill-shaped badges with tracking for section coordinates and service callouts.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeBadge variant="default">AT YOUR SERVICE</ThemeBadge>
                  <ThemeBadge variant="forest">HARVEST № 01</ThemeBadge>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-[#1A1A1A]/50">
                <code>&lt;ThemeBadge&gt;AT YOUR SERVICE&lt;/ThemeBadge&gt;</code>
                <button
                  onClick={() => copyCode(`<ThemeBadge>AT YOUR SERVICE</ThemeBadge>`, 3)}
                  className="inline-flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-wider hover:text-black"
                >
                  {copiedIndex === 3 ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 3 ? 'COPIED' : 'COPY JSX'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-[#E5E5E1] flex items-center justify-between font-sans text-[11px] text-[#1A1A1A]/50">
            <span>CLEAN MINIMALISM THEME SYSTEM</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-[#1A1A1A] text-white font-bold uppercase tracking-wider text-[10px] hover:bg-[#333333] transition-colors"
            >
              CLOSE THEME LAB
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

