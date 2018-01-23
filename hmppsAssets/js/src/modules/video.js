export default (function () {
  return {
    init: function init() {
      const myPlayer = document.querySelector('.video-js.custom-video');

      if (myPlayer) {
        const titleText = document.querySelector('.video-js.custom-video').getAttribute('data-videotitle');
        const Component = HMPPS.videojs.getComponent('Component');
        // The videojs.extend function is used to assist with inheritance. In
        // an ES6 environment, `class TitleBar extends Component` would work
        // identically.
        const TitleBar = HMPPS.videojs.extend(Component, {

          // The constructor of a component receives two arguments: the
          // player it will be associated with and an object of options.
          constructor(player, options) {
            // It is important to invoke the superclass before anything else,
            // to get all the features of components out of the box!
            Component.apply(this, arguments);

            // If a `text` option was passed in, update the text content of
            // the component.
            if (options.text) {
              this.updateTextContent(options.text);
            }
          },

          // The `createEl` function of a component creates its DOM element.
          createEl() {
            return HMPPS.videojs.dom.createEl('div', {

              // Prefixing classes of elements within a player with "vjs-"
              // is a convention used in Video.js.
              className: 'vjs-title-bar',
            });
          },

          // This function could be called at any time to update the text
          // contents of the component.
          updateTextContent(text) {
            // If no text was provided, default to empty
            if (typeof text !== 'string') {
              text = '';
            }

            // Use Video.js utility DOM methods to manipulate the content
            // of the component's element.
            HMPPS.videojs.dom.emptyEl(this.el());
            HMPPS.videojs.dom.appendContent(this.el(), text);
          },
        });

        // Register the component with Video.js, so it can be used in players.
        HMPPS.videojs.registerComponent('TitleBar', TitleBar);

        const player = HMPPS.videojs('video', {
          controls: true,
          autoplay: false,
          preload: 'auto',
          BigPlayButton: false,
        });

        // Add the TitleBar as a child of the player and provide it some text that can be cmsable
        // in its options.
        player.addChild('TitleBar', { text: titleText });

        player.on('play', (e) => {
          const bar = document.querySelector('.vjs-title-bar');

          bar.classList.add('fade-out');
        });
      }
    },

  };
}());
