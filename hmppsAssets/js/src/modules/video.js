export default (function () {
  return {
    init: function init() {
      const myPlayer = document.querySelector('.video-js.custom-video');
      if (myPlayer) {
        HMPPS.videojs('video', {
          controls: true,
          autoplay: false,
          preload: 'auto',
          BigPlayButton: false,
        });
      }
    },

  };
}());
