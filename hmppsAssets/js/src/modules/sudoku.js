export default (function () {
  return {
    init: function init() {
      const alert = document.querySelector('.js-sudoku-alert');
      const newGame = document.querySelector('.js-sudoku-newgame');
      if (!alert) {
        return false;
      }
      const mySudokuJS = $('.js-sudoku').sudokuJS({
        difficulty: 'Easy',
        boardFinishedFn: function (data) {
          alert.classList.add('show');
        }
      });

      newGame.addEventListener('click', (e) => {
        alert.classList.remove('show');
        HMPPS.sudoku.clearErrors();
        mySudokuJS.generateBoard('easy');
      });
    },
    clearErrors(){
      $('.js-sudoku input').filter(function() {
        $(this).removeAttr('disabled');
        $(this).removeClass('board-cell--error highlight-val');
      });
    },
  };
}());
