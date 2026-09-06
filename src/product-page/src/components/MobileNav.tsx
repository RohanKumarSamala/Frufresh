import React, { useEffect, useState } from 'react';
import { FruitSpecimen, FruitId } from '../types';

interface MobileNavProps {
  fruits: FruitSpecimen[];
  activeView: FruitId;
  onSelectView: (view: FruitId) => void;
}

/**
 * The phone counterpart to RailNav, and deliberately the same object as
 * the home page's menu: one button top-right, one ink panel carrying
 * Home and the three cultivars in the display serif.
 *
 * Home is a real link back to the main site. The cultivars switch in
 * place, exactly as the rail does, so the frame sequence is not reloaded
 * just to change fruit.
 */
export function MobileNav({ fruits, activeView, onSelectView }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Escape closes, and the page behind is locked while it is open so a
  // swipe moves the menu rather than scrubbing the frame sequence.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('fr-nav-open', isOpen);
    return () => document.body.classList.remove('fr-nav-open');
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className="fr-nav-toggle"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="fr-nav-drawer"
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className="fr-nav-toggle-bars" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <div
        id="fr-nav-drawer"
        className={`fr-nav-drawer${isOpen ? ' is-open' : ''}`}
      >
        <div className="fr-nav-scrim" onClick={() => setIsOpen(false)} />
        <nav className="fr-nav-panel" aria-label="Main">
          <p className="fr-nav-eyebrow">Frufresh</p>
          <ul className="fr-nav-list">
            <li>
              <a href="/">Home</a>
            </li>
            {fruits.map((fruit) => (
              <li key={fruit.id}>
                <button
                  type="button"
                  data-active={fruit.id === activeView}
                  onClick={() => {
                    onSelectView(fruit.id as FruitId);
                    setIsOpen(false);
                  }}
                >
                  {fruit.name}
                </button>
              </li>
            ))}
          </ul>
          <p className="fr-nav-foot">Known for knowing fruit.</p>
        </nav>
      </div>
    </>
  );
}
