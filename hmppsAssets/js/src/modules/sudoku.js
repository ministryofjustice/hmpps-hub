export default (function () {
  return {
    init: function init() {
      const mySudokuJS = $('.js-sudoku').sudokuJS({
        difficulty: 'Easy',
        boardFinishedFn: function (data) {
          $('.js-sudoku-alert').addClass('show');
        }
      });
    /*window.setInterval(function(){
        mySudokuJS.solveStep();
    }, 100);*/
      $('.new-game').on('click', () => {
        $('.js-sudoku-alert').removeClass('show');
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
