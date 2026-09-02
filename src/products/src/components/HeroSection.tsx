import React from 'react';
import { FruitSpecimen } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSectionProps {
  selectedFruit: FruitSpecimen;
  onOpenPartnership: () => void;
  onSelectNextFruit: () => void;
  isDarkMode?: boolean;
}

/**
 * Rebuilt in the home site's language: ink and brand red only, letterspaced
 * monospace for labels, serif for anything that carries meaning, hairline
 * rules instead of boxes.
 *
 * What went, and why:
 *   - amber / emerald / rose gradient meters, an emerald "verified" badge,
 *     a green pulsing dot and copper eyebrow text — five colours the rest
 *     of the site never uses
 *   - outlined pills with sparkle icons around the tasting notes; the notes
 *     read better as a plain list
 *   - 7–9px type, which was unreadable and made everything feel cramped
 */

// One label + value pair, as used across both columns.
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="fr-label">{label}</div>
      <div className="fr-value">{value}</div>
    </div>
  );
}

// onOpenPartnership / onSelectNextFruit stay on the props interface because
// App still passes them, but the hero no longer has controls of its own:
// the partnership modal is opened from the footer and the anatomy overlay,
// and the cultivar switch lives in the overlay and the rail nav.
export function HeroSection({ selectedFruit }: HeroSectionProps) {
  return (
    <section
      id="hero-section"
      className="relative flex flex-col justify-center pt-24 pb-16 min-h-[92vh]"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* LEFT — the specimen itself */}
        <div className="lg:col-span-4">
          <div className="fr-hero-copy space-y-6 select-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFruit.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <p className="fr-label fr-label--accent">Reservations open</p>
                <h1 className="fr-display">{selectedFruit.heroHeadline}</h1>
                <p className="fr-body">{selectedFruit.heroSubheadline}</p>
              </motion.div>
            </AnimatePresence>

            <div className="fr-rule-top grid grid-cols-2 gap-5">
              <Field label="Sugar index" value={`${selectedFruit.brixLevel}° Brix`} />
              <Field label="Acidity" value={selectedFruit.acidity} />
            </div>

          </div>
        </div>

        {/* Everything right of the fruit is intentionally empty. */}
      </div>
    </section>
  );
}
