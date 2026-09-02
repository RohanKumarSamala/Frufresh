import React, { useState } from 'react';
import { FruitSpecimen, PartnershipInquiry } from '../types';
import { ThemeButton } from './ThemeButton';
import { X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FrufreshLogo } from './FrufreshLogo';

interface PartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFruit: FruitSpecimen;
  isDarkMode?: boolean;
}

export function PartnershipModal({ isOpen, onClose, selectedFruit, isDarkMode = false }: PartnershipModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<PartnershipInquiry>({
    name: '',
    organization: '',
    email: '',
    tier: 'culinary',
    varietyInterest: [selectedFruit.name],
    message: '',
  });

  const isApple = selectedFruit.id === 'apple';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          className={`relative w-full max-w-xl rounded-[32px] p-6 sm:p-8 transition-all duration-700 ${
            isApple ? 'glass-card-editorial-apple' : 'glass-card-editorial-orange'
          } text-[#1A1A1A]`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.08]">
            <div className="flex items-center gap-3">
              <FrufreshLogo size="sm" isDarkMode={isDarkMode} />
              <div className="h-6 w-px bg-black/10" />
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                    ALLOCATION INQUIRY
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#1A1A1A]/50 ml-1">VINTAGE 2026</span>
                </div>
                <h2 className="font-serif text-2xl font-normal leading-tight">
                  Request Harvest Allocation
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full glass-pill-luxury text-[#1A1A1A]/80 hover:text-[#1A1A1A] hover:scale-105 transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-[#1A2F23]/90 backdrop-blur-md border border-emerald-500/30 text-emerald-300 mb-1 shadow-md">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-[#1A1A1A]">
                Allocation Request Logged
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/80 max-w-sm mx-auto leading-relaxed">
                Thank you for initiating allocation for <span className="text-[#1A1A1A] font-bold">{selectedFruit.name}</span>. Our orchard team will review your culinary specifications.
              </p>
              <div className="pt-4">
                <ThemeButton
                  variant="primary-split"
                  size="md"
                  onClick={handleReset}
                >
                  RETURN TO ARCHIVE
                </ThemeButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]/75 mb-1.5">
                    REPRESENTATIVE NAME *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Chef Laurent or Estate Curator"
                    className="w-full rounded-2xl glass-card-subtle px-4 py-2.5 font-sans text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:border-white focus:outline-none transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]/75 mb-1.5">
                    ORGANIZATION / KITCHEN *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Atelier Botanique"
                    className="w-full rounded-2xl glass-card-subtle px-4 py-2.5 font-sans text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:border-white focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]/75 mb-1.5">
                  DIRECT EMAIL DISPATCH *
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="curator@domain.com"
                  className="w-full rounded-2xl glass-card-subtle px-4 py-2.5 font-sans text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:border-white focus:outline-none transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]/75 mb-1.5">
                  PARTNERSHIP TIER
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['culinary', 'boutique', 'private_collector'] as const).map((tierKey) => (
                    <button
                      type="button"
                      key={tierKey}
                      onClick={() => setFormData({ ...formData, tier: tierKey })}
                      className={`py-2.5 px-2 rounded-2xl font-mono text-[9px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                        formData.tier === tierKey
                          ? 'glass-btn-obsidian shadow-md'
                          : 'glass-card-subtle text-[#1A1A1A]/75 hover:border-white'
                      }`}
                    >
                      {tierKey.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]/75 mb-1.5">
                  ALLOCATION SPECIFICATIONS
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Specify weekly volume, desired ripeness window..."
                  className="w-full rounded-2xl glass-card-subtle px-4 py-2.5 font-sans text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:border-white focus:outline-none transition-all resize-none shadow-inner"
                />
              </div>

              {/* Submit footer */}
              <div className="pt-3.5 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]/70">
                  CULTIVAR: {selectedFruit.name.toUpperCase()} ({selectedFruit.brixLevel}° Bx)
                </span>

                <ThemeButton
                  type="submit"
                  variant="primary-split"
                  size="sm"
                >
                  DISPATCH REQUEST
                </ThemeButton>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


