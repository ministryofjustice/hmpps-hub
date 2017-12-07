export default (function () {
  return {
    init: function init() {
      // Epub books
      // EPUBJS.filePath = 'js/libs/';
      // EPUBJS.cssPath = window.location.href.replace(window.location.hash, '').replace('index.html', '') + "css/";
      // // fileStorage.filePath = EPUBJS.filePath;
      // window.reader = ePubReader("http://s3.amazonaws.com/moby-dick/");

      const triggers = document.querySelectorAll('.js-ereader-trigger');
      if (!triggers) {
        return false;
      }
      Array.prototype.forEach.call(triggers, (el, i) => {
        const heading = el.querySelector('h2');
        heading.textContent = heading.textContent + ' (opens in new window)';

        el.addEventListener('click', (e) => {
          HMPPS.ereader.openBook(e);
        });
      });
    },
    openBook(e) {
      e.preventDefault();
      var filePath = e.currentTarget.getAttribute('href');
      var fileType = e.currentTarget.getAttribute('data-filetype');
      // const params = [
      //   `height=${screen.height }`,
      //   `width=${screen.width }`,
      //   'fullscreen=yes',
      //   'scrollbars=no',
      //   'toolbar=no',
      //   'location=no',
      //   'status=no',
      //   'menubar=no',
      //
      // ].join(',');

      if (fileType === 'pdf') {
        const win = window.open(`${filePath}?page=0`,'_blank');

      } else {
        const win = window.open(`${filePath}?page=0`,'_blank');

        HMPPS.ereader.createEpub(filePath, win);
      }
    },
    createEpub(src, win) {
      HMPPS.ereader.createMarkup(win);
      const body = win.document.body;



      let next = body.querySelector('.js-ereader-next');
      let prev = body.querySelector('.js-ereader-prev');
      const area = body.querySelector('.js-ereader-area');
      // const Book = ePub(src, { layout: 'auto', orientation: 'auto' });
      const Book = new EPUBJS.Book({
        width: win.innerWidth / 2,
        height: win.innerHeight,
        orientation:'auto',
        spreads: 'false',
        restore: 'true',
        bookPath: src,
        method: 'paginate',
        contained: 'true',
        //styles: { hmpps: '/hmppsAssets/hmpps.css'},

      });

      //Book.generatePagination(50, 100);
      const rendered = Book.renderTo(area);



      rendered.then(() => {
        // const currentLocation = Book.getCurrentLocationCfi();
        // const currentPage = Book.pagination.pageFromCfi(currentLocation);
        // currentPage.value = currentPage;
        Book.open(src);
      });

      prev.addEventListener('click', () => {
        Book.prevPage();
      });
      next.addEventListener('click', () => {
        Book.nextPage();
      });

      win.addEventListener('keyup', (e) => {
        if ((e.keyCode || e.which) === 37) {
          Book.prevPage();
        }
        // Right Key
        if ((e.keyCode || e.which) === 39) {
          Book.nextPage();
        }
      })


      //Book.on('keyup', keyListener);
    },
    createMarkup(win, area) {
      let html = document.createElement('div');
      html.innerHTML = `<div class="ereader__area js-ereader-area"></div>
      <div class="ereader__buttons">
        <button class="js-ereader-prev ereader__prev" type="button" name="button">Prev</button>
        <button class="js-ereader-next ereader__next" type="button" name="button">Next</button>
      </div>`;
      html.classList.add('ereader');
      win.document.write('<html><head><title>Book</title><link href="/hmppsAssets/css/hmpps.css"  rel="stylesheet" type="text/css"></head><body></body></html>');

      win.document.body.appendChild(html);
      win.document.body.classList.add('epub');

    }
  };
}());
