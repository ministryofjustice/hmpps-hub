// Polyfills
import './govuk/details.polyfill';
import './vendor/polyfills/bind';

// modules
import govUKCookie from './govuk/cookie';


// set up namespace
const HMPPS = window.HMPPS || {};

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
