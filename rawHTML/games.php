<?php
$title = 'Games';
include('_includes/head.php'); ?>
<?php include('_includes/header.php'); ?>

<div id="global-header-bar"></div>

<div class="site-wrapper">
  <div class="breadcrumbs">
    <ol>
      <li><a href="index.php">Home</a></li>
      <li aria-current="page">Games</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">
   
    <div class="pub-c-title">
        <h1 class="heading-xlarge">Games</h1>
    </div>

    <div class="image-grid">
      <div class="grid-row">
        <div class="column-one-third">
          <div class="image-grid-item">
            <a href="chess.php"><img src="_dummy/img/chess.jpg" alt="">
            <h2 class="heading-medium">Chess</h2>
            </a>
          </div>
        </div>
        <div class="column-one-third">
          <div class="image-grid-item">
            <a href="sudoku.php"><img src="_dummy/img/sudoku.png" alt="">
            <h2 class="heading-medium">Sudoku</h2>
            </a>
          </div>
        </div>
        <div class="column-one-third">
          <div class="image-grid-item">
            <a href="neontroids.php"><img src="_dummy/img/neontroids.png" alt="">
            <h2 class="heading-medium">Neontroids</h2>
            </a>
          </div>
        </div>
      </div>
    </div>
  </main><!-- / #content -->

</div>

<?php include('_includes/footer.php'); ?>
