export default (function () {
  return {
    init: function init() {
      const triggers = document.querySelectorAll('.js-viewers');
      if (!triggers) {
        return false;
      }
      Array.prototype.forEach.call(triggers, (el, i) => {
        const heading = el.querySelector('h2');
        heading.textContent += ' (opens in new tab)';
      });
    }
  };
}());
