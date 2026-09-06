import { useEffect, useState } from 'react';

/**
 * True below the phone breakpoint. Used where the difference is
 * structural rather than cosmetic — the anatomy callouts are pinned to
 * coordinates on the fruit at desktop and stack into a list on a phone,
 * which is not something a media query can do to a `fixed` element
 * without a pile of !important overrides.
 *
 * Kept as one shared breakpoint so the CSS in index.css and the layout
 * decisions in JS cannot drift apart.
 */
export const MOBILE_QUERY = '(max-width: 768px)';

export function useIsMobile(): boolean {
  // Read synchronously on first render: starting false and correcting in
  // an effect makes the desktop layout mount for a frame on a phone,
  // which is exactly the overlapping mess this is meant to avoid.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
