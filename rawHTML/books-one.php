<?php
$title = 'Books by Genre';
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
      <li aria-current="page">Books by Genre</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">

    <div class="browse">
      <div class="browse-panes section-only" data-state="section" data-module="track-click" aria-busy="false">
        <div id="section" class="section-pane with-sort pane" style="">
          <div class="pane-inner alphabetical" style="">
            <h1 tabindex="-1">Genres</h1>
            <p class="sort-order" style="">A to Z</p>
            <ul>
              <li>
                <a href="books-two.php" class="">
                  <h3>Action</h3>
                  <p>Includes when and how benefit payments are made, benefits calculators and benefit fraud</p>
                </a>
              </li>
              <li>
                <a href="books-two.php" class="">
                  <h3>Adventure</h3>
                  <p>Includes when and how benefit payments are made, benefits calculators and benefit fraud</p>
                </a>
              </li>
              <li>
                <a href="books-two.php" class="">
                  <h3>Comedy</h3>
                  <p>Includes when and how benefit payments are made, benefits calculators and benefit fraud</p>
                </a>
              </li>
              <li>
                <a href="books-two.php" class="">
                  <h3>Crime</h3>
                  <p>Includes when and how benefit payments are made, benefits calculators and benefit fraud</p>
                </a>
              </li>
              <li>
                <a href="books-two.php" class="">
                  <h3>Drama</h3>
                  <p>Includes when and how benefit payments are made, benefits calculators and benefit fraud</p>
                </a>
              </li>
              <li>
                <a href="books-two.php" class="">
                  <h3>Horror</h3>
                  <p>Includes when and how benefit payments are made, benefits calculators and benefit fraud</p>
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </main><!-- / #content -->

</div>

<?php include('_includes/footer.php'); ?>
