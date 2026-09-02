import React from 'react';
import { FruitSpecimen } from '../types';
import { FrufreshLogo } from './FrufreshLogo';

interface HeaderProps {
  fruits: FruitSpecimen[];
  selectedFruit: FruitSpecimen;
  activeView: 'apple' | 'orange';
  onSelectView: (view: 'apple' | 'orange') => void;
  onOpenPartnership: () => void;
  onOpenThemeSandbox?: () => void;
  isDarkMode?: boolean;
}

/**
 * Just the brand mark now. Cultivar switching moved to the left rail
 * (RailNav), matching the home page, so the bar carries no controls.
 */
export function Header({ isDarkMode = false }: HeaderProps) {
  return (
    <header id="architectural-top-header" className="fr-header">
      <a href="/" className="fr-brand" aria-label="Back to Frufresh">
        <FrufreshLogo isDarkMode={isDarkMode} size="md" />
      </a>
    </header>
  );
}
