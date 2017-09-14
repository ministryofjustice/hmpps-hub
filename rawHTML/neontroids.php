<?php
$title = 'Neontroids';
include('_includes/head.php'); ?>

<?php include('_includes/header.php'); ?>

<div id="global-header-bar"></div>

<div class="site-wrapper">
  <div class="breadcrumbs">
    <ol>
      <li><a href="index.php">Home</a></li>
      <li><a href="games.php">Games</a></li>
      <li aria-current="page">Neontroids</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">
  <div class="grid-row">
    <div class="column-two-thirds">
      <div class="pub-c-title">
        <h1 class="pub-c-title__text">Neontroids</h1>
      </div>
      <div class="games neontroids js-neontroids">
        <img class="neontroids__img" src="_dummy/img/neontroids.png" alt="">
      </div>
      <div class="content">
        <button class="js-neontroids-trigger button" type="button" name="button">Play Neontroids (opens full screen)</button>
        <h3>How to play</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum..</p>
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
              <a href="sudoku.php">Sudoku</a>
            </li>
          </ul>
        </nav>
      </aside>
      <aside class="related-content" data-module="track-click" role="complementary">
        <h2>Books we recommend</h2>
        <nav role="navigation">
          <ul class="list">
            <li>
              <a href="books.php">How to play sudoku</a>
            </li>
            <li>
              <a href="books.php">Another Link</a>
            </li>
            <li>
              <a href="books.php">How to win at Chess</a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  </div>
  </main><!-- / #content -->
</div>

<?php include('_includes/footer.php'); ?>
