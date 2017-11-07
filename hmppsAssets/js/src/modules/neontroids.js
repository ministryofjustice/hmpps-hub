export default (function () {
  return {
    init: function init() {
      const neontroidsEl = document.querySelector('.js-neontroids');
      const trigger = document.querySelector('.js-neontroids-trigger');

      if (neontroidsEl) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          trigger.setAttribute('disabled', true);
          HMPPS.neontroids.build();
          const scripts = ['/hmppsAssets/js/src/third-party/lib/sound-fx.js', '/hmppsAssets/js/src/third-party/lib/keyboard-io.js', '/hmppsAssets/js/src/third-party/lib/collisions.js', '/hmppsAssets/js/src/third-party/lib/asteroids-sprites.js', '/hmppsAssets/js/src/third-party/lib/asteroids-polygon.js', '/hmppsAssets/js/src/third-party/lib/display-text.js', '/hmppsAssets/js/src/third-party/lib/asteroids.js'];

          const loader = new HMPPS.neontroids.ScriptLoader();
          const scriptPromises = scripts.map(file => loader.add(file));

          Promise.all(scriptPromises).then((response) => {
            neontroidsEl.classList.add('neontroids-active');
            document.body.classList.add('modal-active');

            const root = document.getElementsByTagName('html')[0];
            root.classList.add('modal-active');


            const close = document.querySelector('.js-neontroids-close');
            close.addEventListener('click', () => {
              HMPPS.neontroids.destroy(trigger);
            });

            const modal = document.querySelector('.modal');

            modal.focus();

            if (document.body.classList.contains('modal-active')) {
              document.addEventListener('keyup', (e) => {
                if ((e.keyCode || e.which) === 27) {
                  HMPPS.neontroids.destroy(trigger);
                }
              });
            }

            return response;
          }).then((response) => {
            window.dispatchEvent(new Event('resize'));
            HMPPS.neontroids.beginGame();
          });
        });
      }
    },
    beginGame() {
      initHighScore();
      createRocks();
      initKeyboard();
      runGame();
    },
    build() {
      const modal = document.createElement('div');
      modal.classList.add('modal');

      const canvas = `<canvas id='canvas' class='canvas'></canvas>
      <button class='js-neontroids-close neontroids__close' type='button' name='button'>Close</button>`;

      modal.innerHTML = canvas;
      document.body.appendChild(modal);
    },
    destroy(trigger) {
      const root = document.getElementsByTagName('html')[0];
      const modal = document.querySelector('.modal');
      const body = document.body;
      body.removeChild(modal);
      root.classList.remove('modal-active');
      body.classList.remove('modal-active');
      gameState = 'stopped';
      trigger.removeAttribute('disabled');
      stopGame();
    },
    ScriptLoader() {
      const promises = [];

      this.add = (url) => {
        const promise = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = url;
          script.type = 'text/javascript';
          script.async = true;
          script.addEventListener('load', () => {
            resolve(script);
          }, false);
          script.addEventListener('error', () => {
            reject(script);
          }, false);

          document.body.appendChild(script);
        });
        return promise;
      };

      this.loaded = (callbackOnFailed) => {
        Promise.all(promises).then((result1) => {
          console.log('Script loaded from:', result1);
        }, callbackOnFailed);
      };
    },
  };
}());
