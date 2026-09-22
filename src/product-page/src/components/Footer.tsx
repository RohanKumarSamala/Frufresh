import React from 'react';

interface FooterProps {
  onOpenPartnership?: () => void;
}

export function Footer({ onOpenPartnership }: FooterProps) {
  return (
    <footer id="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img className="footer-logo" src="/assets/images/logo.png" alt="Fru Fresh" />
          <p className="footer-tagline">
            Known for<br />
            <em>knowing fruit.</em>
          </p>
          <p className="footer-blurb">
            Fresh produce sourced from growers across 12+ countries and
            distributed through 8 states in India — built on relationships
            rather than transactions.
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <div className="footer-col">
            <h2 className="footer-heading">Explore</h2>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/products/?fruit=apple">Apples</a></li>
              <li><a href="/products/?fruit=orange">Oranges</a></li>
              <li><a href="/products/?fruit=dragonfruit">Dragon Fruit</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Company</h2>
            <ul>
              <li><a href="/#founder">The Founder</a></li>
              <li><a href="/#leadership">Leadership</a></li>
              <li><a href="/#story">Our Story</a></li>
            </ul>
          </div>

          <div className="footer-col footer-col--contact">
            <h2 className="footer-heading">Get in touch</h2>
            <ul>
              <li>
                <a className="footer-email" href="mailto:frufreshindia@gmail.com">
                  frufreshindia@gmail.com
                </a>
              </li>
              <li>
                <a
                  className="footer-social"
                  href="https://www.instagram.com/frufresh_ind"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Fru Fresh on Instagram"
                >
                  <span className="footer-social-glyph">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4.1" />
                      <circle className="is-dot" cx="17.2" cy="6.8" r="1.15" />
                    </svg>
                  </span>
                  <span>@frufresh_ind</span>
                </a>
              </li>
              <li className="footer-place">Hyderabad, Telangana &middot; India</li>
              {onOpenPartnership && (
                <li className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenPartnership}
                    className="inline-flex items-center gap-1 text-xs font-mono tracking-wider uppercase text-[#c72f1d] hover:underline cursor-pointer transition-colors"
                  >
                    <span>Allocation Inquiry &rarr;</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>

      <dl className="footer-figures">
        <div>
          <dt>12+</dt>
          <dd>countries sourced from</dd>
        </div>
        <div>
          <dt>8</dt>
          <dd>states distributed across</dd>
        </div>
        <div>
          <dt>50+</dt>
          <dd>years in fresh produce</dd>
        </div>
      </dl>

      <div className="footer-base">
        <span>&copy; 2026 Fru Fresh. All rights reserved.</span>
        <span className="footer-base-right">Fresh produce, sourced properly.</span>
      </div>
    </footer>
  );
}
