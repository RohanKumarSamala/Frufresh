import React from 'react';

interface FrufreshLogoProps {
  className?: string;
  isDarkMode?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

/**
 * The real Frufresh mark, served from the main site at /assets/images/logo.png — the
 * same file the home page uses, so both carry identical artwork.
 *
 * This previously drew an approximation of the wordmark in SVG. Swapping
 * the component rather than the call sites means the header, footer,
 * home page and modal all pick up the real logo.
 *
 * `isDarkMode` is accepted for API compatibility but not used for tinting:
 * the mark is fixed artwork, and recolouring it would no longer be the
 * brand's logo.
 */
export function FrufreshLogo({
  className = '',
  size = 'md',
}: FrufreshLogoProps) {
  const sizeClasses = {
    sm: 'h-7',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14',
  };

  return (
    <span className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/assets/images/logo.png"
        alt="Frufresh"
        className={`${sizeClasses[size]} w-auto block`}
      />
    </span>
  );
}
