<?php
$title = 'Games';
include('_includes/head.php'); ?>

<header role="banner" id="global-header">
  <div class="header-wrapper">
    <div class="header-global">
      <h1 class="heading-large hub-logo">
        <a href="index.php" title="Go to the hub homepage" id="logo" class="content">
          The Hub
        </a>
      </h1>
    </div>
  </div>
</header>

<div id="global-header-bar"></div>

<div class="site-wrapper">
  <div class="breadcrumbs">
    <ol>
      <li><a href="index.php">Home</a></li>
      <li aria-current="page">Games</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">
    <h1 class="heading-large">Games</h1>

    <div class="image-grid">
      <div class="grid-row">
        <div class="column-one-third">
          <div class="image-grid-item">
            <a href="games.php"><img src="_dummy/img/chess.jpg" alt=""></a>
            <h2 class="heading-medium"><a href="games.php">Chess</a></h2>
          </div>
        </div>
        <div class="column-one-third">
          <div class="image-grid-item">
            <a href="games.php"><img src="_dummy/img/sudoku.png" alt=""></a>
            <h2 class="heading-medium"><a href="games.php">Sudoku</a></h2>
          </div>
        </div>
        <div class="column-one-third">
          <div class="image-grid-item">
            <a href="games.php"><img src="_dummy/img/neontroids.png" alt=""></a>
            <h2 class="heading-medium"><a href="games.php">Neontroids</a></h2>
          </div>
        </div>
      </div>
    </div>
  </main><!-- / #content -->

</div>

<?php include('_includes/footer.php'); ?>
