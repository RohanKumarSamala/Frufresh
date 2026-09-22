import React from 'react';

/**
 * Static guide lines, in the Frufresh home-page language: one vertical
 * rule down the left and one horizontal across the top, meeting at a
 * four-pointed star.
 *
 * Deliberately static — no scroll listener, no animation, no state. The
 * positions come from the CSS custom properties in index.css.
 */
export interface GuideGridProps {
  inDossier?: boolean;
}

export function GuideGrid({ inDossier = false }: GuideGridProps) {
  return (
    <div className={`fr-grid ${inDossier ? 'in-dossier' : ''}`} aria-hidden="true">
      <div className="fr-nav-mask" />
      <span className="fr-line fr-line--v fr-l" />
      <span className="fr-line fr-line--h fr-t" />
      <span className="fr-mark fr-mark--tl" />
    </div>
  );
}
