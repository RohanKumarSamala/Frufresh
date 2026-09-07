import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';

// Same reasoning as the home page's script.js. This page is scrubbed too —
// scroll position drives the frame sequence and which chapter is on screen —
// so a restored offset lands you mid-sequence on a fruit that has not
// finished preloading. Reloads start at the hero.
//
// Before render, because the browser restores during the first frames of
// load, and because App's own snap-scroll reads window.scrollY on mount.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
