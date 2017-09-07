<?php
$title = 'Books by Genre';
include('_includes/head.php'); ?>
<?php include('_includes/header.php'); ?>

<div id="global-header-bar"></div>

<div class="site-wrapper">
  <div class="breadcrumbs">
    <ol>
      <li><a href="index.php">Home</a></li>
      <li><a href="books-one.php">Books by Genre</a></li>
      <li aria-current="page">Comedy</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">

    <div class="browse">
      <div class="browse-panes subsection no-root" data-state="section" data-module="track-click" aria-busy="false">
        <div id="subsection" class="subsection-pane pane" style="">
          <div class="pane-inner a-to-z">
            <h1 tabindex="-1">Comedy</h1>
            <p class="sort-order">A to Z</p>
            <ul>
              <li><a href="list-two.php">Action comedy</a></li>
              <li><a href="list-two.php">Comedy drama</a></li>
              <li><a href="list-two.php">Romantic comedy</a></li>
              <li><a href="list-two.php">Horror comedy</a></li>
              <li><a href="list-two.php">Fantasy comedy</a></li>
              <li><a href="list-two.php">Military comedy</a></li>
            </ul>
          </div>
        </div>
        <div id="section" class="section-pane pane" style="">
          <div class="pane-inner alphabetical" style="">
            <h1 tabindex="-1">Genres</h1>
            <p class="sort-order" style="">A to Z</p>
            <ul>
                <li><a href="list-two.php" class="">Action</a></li>
                <li><a href="list-two.php" class="">Adventure</a></li>
                <li class="active"><a href="list-two.php" class="">Comedy</a></li>
                <li><a href="list-two.php" class="">Crime</a></li>
                <li><a href="list-two.php" class="">Drama</a></li>
                <li><a href="list-two.php" class="">Horror</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </main><!-- / #content -->

</div>

<?php include('_includes/footer.php'); ?>
