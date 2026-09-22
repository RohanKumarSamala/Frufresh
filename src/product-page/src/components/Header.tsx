import React from 'react';
import { FruitSpecimen, FruitId } from '../types';
import { FrufreshLogo } from './FrufreshLogo';

interface HeaderProps {
  fruits: FruitSpecimen[];
  selectedFruit: FruitSpecimen;
  activeView: FruitId;
  onSelectView: (view: FruitId) => void;
  onOpenPartnership: () => void;
  onOpenThemeSandbox?: () => void;
  isDarkMode?: boolean;
  inDossier?: boolean;
}

/**
 * Just the brand mark now. Cultivar switching moved to the left rail
 * (RailNav), matching the home page, so the bar carries no controls.
 */
export function Header({ isDarkMode = false, inDossier = false }: HeaderProps) {
  return (
    <header id="architectural-top-header" className={`fr-header ${inDossier ? 'in-dossier' : ''}`}>
      <a href="/" className="fr-brand" aria-label="Back to Frufresh">
        <FrufreshLogo isDarkMode={isDarkMode} size="md" />
      </a>
    </header>
  );
}
