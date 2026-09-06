import React from 'react';
import { FruitId } from '../types';

interface RailNavProps {
  activeView: FruitId;
  onSelectView: (view: FruitId) => void;
}

/**
 * Left-rail navigation, matching the home page's — the 2x2 mark for home
 * and fruit silhouettes for the cultivars. Every glyph inherits
 * currentColor, so it follows its label's ink instead of introducing
 * colours the rest of the site does not use.
 *
 * Home is a real link back to the main site; the cultivars switch in
 * place rather than navigating, so the frame sequence does not reload.
 */
const HomeMark = () => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <rect x="1" y="1" width="4.6" height="4.6" />
    <rect x="8.4" y="1" width="4.6" height="4.6" />
    <rect x="1" y="8.4" width="4.6" height="4.6" />
    <rect x="8.4" y="8.4" width="4.6" height="4.6" />
  </svg>
);

const AppleMark = () => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M7 4.6c-1-1.1-2.6-1.3-3.6-.3-1.3 1.1-1.4 3.3-.5 5 .6 1.3 1.7 2.7 2.7 3.2.8.4 1.2.1 1.4 0 .2.1.6.4 1.4 0 1-.5 2.1-1.9 2.7-3.2.9-1.7.8-3.9-.5-5-1-1-2.6-.8-3.6.3z" />
    <path d="M7.5 3.5c.5-1 1.7-1.5 2.7-1.4-.1 1-.8 2-2 2.2-.5.1-.8-.2-.7-.8z" />
  </svg>
);

const OrangeMark = () => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <circle cx="7" cy="8.3" r="4.6" />
    <path d="M7.3 3.4c.5-1 1.6-1.5 2.6-1.4-.1 1-.8 1.9-1.9 2.1-.5.1-.8-.2-.7-.7z" />
  </svg>
);

const DragonFruitMark = () => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    {/* Body: an egg-shaped pitaya sitting low in the frame, so the crown
        of leaf-spikes above reads clearly at small sizes. */}
    <path d="M7 4.4c2 0 3.6 1.9 3.6 4.2S9 12.8 7 12.8 3.4 10.9 3.4 8.6 5 4.4 7 4.4z" />
    {/* Three spikes, reusing the same pointed-leaf shape as the apple's
        stem leaf, fanned out across the top like the fruit's scales. */}
    <path d="M7 4.6c-.3-1.1.1-2.1.9-2.7.5.9.3 1.9-.3 2.6-.2.2-.4.2-.6.1z" />
    <path d="M4.9 5.3c-.7-.9-1.7-1.2-2.7-1 .4.9 1.3 1.5 2.3 1.5.2 0 .3-.2.4-.5z" />
    <path d="M9.1 5.3c.7-.9 1.7-1.2 2.7-1-.4.9-1.3 1.5-2.3 1.5-.2 0-.3-.2-.4-.5z" />
  </svg>
);

export function RailNav({ activeView, onSelectView }: RailNavProps) {
  return (
    <nav className="fr-rail-nav" aria-label="Sections">
      <a className="fr-rail-link" href="/" aria-label="Home">
        <span className="fr-rail-glyph">
          <HomeMark />
        </span>
      </a>

      <button
        type="button"
        className="fr-rail-link"
        data-active={activeView === 'apple'}
        onClick={() => onSelectView('apple')}
        aria-label="Apple"
      >
        <span className="fr-rail-glyph">
          <AppleMark />
        </span>
        <span className="fr-rail-label">Apple</span>
      </button>

      <button
        type="button"
        className="fr-rail-link"
        data-active={activeView === 'orange'}
        onClick={() => onSelectView('orange')}
        aria-label="Orange"
      >
        <span className="fr-rail-glyph">
          <OrangeMark />
        </span>
        <span className="fr-rail-label">Orange</span>
      </button>

      <button
        type="button"
        className="fr-rail-link"
        data-active={activeView === 'dragonfruit'}
        onClick={() => onSelectView('dragonfruit')}
        aria-label="Dragon Fruit"
      >
        <span className="fr-rail-glyph">
          <DragonFruitMark />
        </span>
        <span className="fr-rail-label">Dragon</span>
      </button>
    </nav>
  );
}
