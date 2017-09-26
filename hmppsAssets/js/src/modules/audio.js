import videojs from 'video.js';
export default (function () {
  return {
    init: function init() {
      videojs('audio-player', {
        controls: true,
        autoplay: false,
        preload: 'auto',
        BigPlayButton : false,
      });
      const myPlayer = document.querySelector('.video-js');
      if (myPlayer) {
        myPlayer.classList.add('audio-player');
      }
    },

  };
}());
