import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export interface SignatureButtonProps {
  children: React.ReactNode;
  variant?: 'primary-split' | 'ghost-coordinate' | 'badge-pill' | 'editorial-solid' | 'glass-pearl';
  iconType?: 'arrow-right' | 'arrow-diagonal' | 'none';
  badgeText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Restyled in the home site's language — square hairline outlines,
 * letterspaced monospace, brand red for emphasis — in place of the glass
 * pills. The prop API is unchanged so every existing call site still works;
 * the variants now map onto two flat treatments.
 */
const EMPHATIC = new Set(['primary-split', 'editorial-solid']);

export function ThemeButton({
  children,
  variant = 'primary-split',
  iconType = 'arrow-right',
  size = 'md',
  className = '',
  id,
  type = 'button',
  onClick,
  disabled = false,
}: SignatureButtonProps) {
  const classes = [
    'fr-btn',
    EMPHATIC.has(variant) ? 'fr-btn--primary' : '',
    size === 'sm' ? 'fr-btn--sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      id={id || 'signature-primary-btn'}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      <span>{children}</span>

      {iconType !== 'none' &&
        (iconType === 'arrow-diagonal' ? (
          <ArrowUpRight className="w-3.5 h-3.5" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5" />
        ))}
    </button>
  );
}

export interface ThemeBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'forest' | string;
  className?: string;
}

/**
 * Small standing label. Kept as its own export because NavigationDrawer
 * and ThemeSandboxModal import it; restyled to the same flat, letterspaced
 * treatment as the buttons.
 */
export function ThemeBadge({
  children,
  variant = 'default',
  className = '',
}: ThemeBadgeProps) {
  const accent = variant === 'forest' ? 'var(--fr-red)' : 'var(--fr-ink-strong)';

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{
        fontFamily: 'var(--fr-mono)',
        fontSize: '9px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: accent,
        border: `1px solid ${accent}`,
        padding: '5px 11px',
      }}
    >
      {children}
    </span>
  );
}
