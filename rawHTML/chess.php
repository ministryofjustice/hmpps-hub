<?php
$title = 'Chess';
include('_includes/head.php'); ?>

<?php include('_includes/header.php'); ?>

<div id="global-header-bar"></div>

<div class="site-wrapper">
  <div class="breadcrumbs">
    <ol>
      <li><a href="index.php">Home</a></li>
      <li><a href="games.php">Games</a></li>
      <li aria-current="page">Chess</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">
  <div class="grid-row">
    <div class="column-two-thirds">
      <div class="pub-c-title">
        <h1 class="heading-xlarge">Chess</h1>
      </div>
      <div class="game chess js-chess">
        <div id="js-board" class="chessboard"></div>
          <h3 class="heading-medium">Moves in this game</h3>
        <div class="moves">
          <p class="js-chessmoves moves__area"></p>
          <pre id=evaluation></pre>
        </div>
        <div class="chess-controls">
         
          <div class="grid-row">

            <div class="column-half">
              <div class="form-group">
                <fieldset>

                  <legend>
                    <h3 class="heading-medium">Pawns get promoted to</h3>
                  </legend>

                  <div class="multiple-choice">
                    <input type="radio" class="js-promote" id="gamechoice1" name="gameChoices" checked value="q">
                    <label class="form-label form-label-inline"  for="gamechoice1">Queen</label>
                  </div>
                  <div class="multiple-choice">
                    <input type="radio" class="js-promote" id="gamechoice2" name="gameChoices" value="r">
                    <label class="form-label form-label-inline" for="gamechoice2">Rook</label>
                  </div>
                  <div class="multiple-choice">
                    <input type="radio" class="js-promote" id="gamechoice3" name="gameChoices" value="n">
                    <label class="form-label form-label-inline" for="gamechoice3">Knight</label>
                  </div>
                  <div class="multiple-choice">
                    <input type="radio" class="js-promote" id="gamechoice4" name="gameChoices" value="b">
                    <label class="form-label form-label-inline" for="gamechoice4">Bishop</label>
                  </div>

                </fieldset>
              </div>
            </div>
            <div class="column-half">
              <div class="form-group">

                <fieldset>
                  <legend>
                    <h3 class="heading-medium">Choose your Skill level</h3>
                  </legend>
                  <div class="form-group js-form-validation">
                    <label for="skillLevel" class="form-label" id="error-skill-level">Skill Level (0-20)</label>
                    <span class="form-hint">Updating this will start a new game</span>
                    <span class="error-message visuallyhidden">
                      This value has to be between 0 and 20
                    </span>
                    <input type="number" class="form-control" id="skillLevel" value="10" min="0" max="20">
                  </div>
                </fieldset>

              </div>
            </div>
          </div>
          <div class="grid-row">

            <div class="column-full">
              <button class="js-newgame button" type="button" name="button">Play a new game</button>
            </div>
          </div>
         </div>
      </div>
    </div>
    <div class="column-third add-title-margin">
      <aside class="related-content" data-module="track-click" role="complementary">
        <h2>More Games</h2>
        <nav role="navigation">
          <ul class="list">
            <li>
              <a href="sudoku.php">Sudoku</a>
            </li>
            <li>
              <a href="neontroids.php">Neontroid</a>
            </li>
          </ul>
        </nav>
      </aside>
      <aside class="related-content" data-module="track-click" role="complementary">
        <h2>Books about Chess</h2>
        <nav role="navigation">
          <ul class="list">
            <li>
              <a href="books.php">How to play chess</a>
            </li>
            <li>
              <a href="books.php">Chess fundamentals</a>
            </li>
            <li>
              <a href="books.php">How to win at chess</a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  </main><!-- / #content -->
</div>

<?php include('_includes/footer.php'); ?>
