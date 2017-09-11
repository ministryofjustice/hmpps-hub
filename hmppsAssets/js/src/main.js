// Polyfills


import './govuk/details.polyfill';
import './vendor/polyfills/bind';

// libs
// import './vendor/lib/jszip.min';
// import './vendor/lib/epub.min';

// import styles
import '../../scss/hmpps.scss';
import '../../scss/hmpps-ie8.scss';
import '../../scss/hmpps-ie7.scss';
import '../../scss/hmpps-ie6.scss';

// modules
import govUKCookie from './govuk/cookie';
import ereader from './modules/ereader';
import chess from './modules/chess';

// set up namespace
const HMPPS = window.HMPPS || {
  ereader,
  chess,
};

HMPPS.addCookieMessage = () => {
  const message = document.getElementById('global-cookie-message');
  const hasCookieMessage = message && govUKCookie('seen_cookie_message') === null;

  if (hasCookieMessage) {
    message.style.display = 'block';
    govUKCookie('seen_cookie_message', 'yes', { days: 28 });
  }
};

// run the initialisation.
document.addEventListener('DOMContentLoaded', () => {
  // run the cookie message
  HMPPS.addCookieMessage();

  // If the modules have init functions, run them
  Object.keys(HMPPS).forEach((module) => {
    if (typeof HMPPS[module].init === 'function') {
      HMPPS[module].init();
    }
  });
});

window.HMPPS = HMPPS;
