export default (function () {
  return {
    init: function init() {
      const myPlayer = document.querySelector('.video-js.audio-player');
      if (myPlayer) {
        HMPPS.videojs('audio-player', {
          controls: true,
          autoplay: false,
          preload: 'auto',
          BigPlayButton: false
        });
      }
    }
  };
}());
