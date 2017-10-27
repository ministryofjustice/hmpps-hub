<?php
$title = 'Sudoku';
include('_includes/head.php'); ?>

<?php include('_includes/header.php'); ?>

<div id="global-header-bar"></div>

<div class="site-wrapper">
  <div class="breadcrumbs">
    <ol>
      <li><a href="index.php">Home</a></li>
      <li><a href="games.php">Games</a></li>
      <li aria-current="page">Sudoku</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">
  <div class="grid-row">
    <div class="column-two-thirds">
      <div class="pub-c-title">
        <h1 class="heading-xlarge">Sudoku</h1>
      </div>
      <div class="games sudoku-board js-sudoku"></div>
      <div class="js-sudoku-alert sudoku__alert">
        <p>Alert</p>
      </div>
      <div class="content">
        <button class="js-sudoku-newgame button" type="button" name="button">Play a new game</button>
        <h2 class="heading-large">How to play</h2>
        <p>Sudoku is a game that involves a grid of 81 squares, divided into nine blocks, each containing nine squares</p>
        <p>Each of the nine blocks has to contain the numbers 1-9, each number can only appear once in a row, column or box. Each vertical nine-square column, or horizontal nine-square line across, within the larger square, must also contain the numbers 1-9, without repetition or omission.</p>
        <p>Each sudoku puzzle has only one correct solution.</p>
      </div>
    </div>
    <div class="column-third add-title-margin">
      <aside class="related-content" data-module="track-click" role="complementary">
        <h2>More Games</h2>
        <nav role="navigation">
          <ul class="list">
            <li>
              <a href="chess.php">Chess</a>
            </li>
            <li>
              <a href="neontroids.php">Neontroid</a>
            </li>
          </ul>
        </nav>
      </aside>
      <aside class="related-content" data-module="track-click" role="complementary">
        <h2>Books about Sudoku</h2>
        <nav role="navigation">
          <ul class="list">
            <li>
              <a href="books.php">How to play sudoku</a>
            </li>
            <li>
              <a href="books.php">Sudoku fundamentals</a>
            </li>
            <li>
              <a href="books.php">How to win at sudoku</a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  </main><!-- / #content -->
</div>

<?php include('_includes/footer.php'); ?>
