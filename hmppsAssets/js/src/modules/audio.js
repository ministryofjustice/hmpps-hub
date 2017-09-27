import videojs from 'video.js';
export default (function () {
  return {
    init: function init() {
      const myPlayer = document.querySelector('.video-js');
      if (myPlayer) {
        videojs('audio-player', {
          controls: true,
          autoplay: false,
          preload: 'auto',
          BigPlayButton : false,
        });
      }
    },

  };
}());
