import React from 'react';

// Exact minimalist pear outline glyph from reference image
export function PearLogoIcon({ className = "w-6 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2C12 2 12.8 5 14 6.5C15.5 8.3 18.5 13 18.5 19.5C18.5 25.5 15.5 29.5 12 29.5C8.5 29.5 5.5 25.5 5.5 19.5C5.5 13 8.5 8.3 10 6.5C11.2 5 12 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Subtle leaf stem accent */}
      <path
        d="M12 2C12.8 0.8 14.5 0.5 16 1.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 4-point diamond star / sparkle reticle at grid intersections
export function DiamondCrosshair({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M10 0L11.8 7.2L19 10L11.8 12.8L10 20L8.2 12.8L1 10L8.2 7.2L10 0Z" />
    </svg>
  );
}

// Minimalist 4-square grid menu icon
export function GridSquaresIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="1" y="1" width="5" height="5" rx="0.5" />
      <rect x="10" y="1" width="5" height="5" rx="0.5" />
      <rect x="1" y="10" width="5" height="5" rx="0.5" />
      <rect x="10" y="10" width="5" height="5" rx="0.5" />
    </svg>
  );
}
