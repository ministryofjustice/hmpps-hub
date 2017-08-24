<?php
$title = 'Radio by Genre';
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
      <li><a href="radio-one.php">Radio by Genre</a></li>
      <li aria-current="page">Past, Present and Future</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">

    <div class="browse">
      <div class="browse-panes subsection no-root" data-state="section" data-module="track-click" aria-busy="false">
        <div id="subsection" class="subsection-pane pane" style="">
          <div class="pane-inner a-to-z">
            <h1 tabindex="-1">Past, present and future</h1>
            <p class="sort-order">A to Z</p>
            <ul>
              <li><a href="radio-two.php">Date of episode goes here</a></li>
              <li><a href="radio-two.php">Date of episode goes here</a></li>
              <li><a href="radio-two.php">Date of episode goes here</a></li>
              <li><a href="radio-two.php">Date of episode goes here</a></li>
              <li><a href="radio-two.php">Date of episode goes here</a></li>
            </ul>
          </div>
        </div>
        <div id="section" class="section-pane pane" style="">
          <div class="pane-inner alphabetical" style="">
            <h1 tabindex="-1">Genres</h1>
            <p class="sort-order" style="">A to Z</p>
            <ul>
                <li><a href="radio-two.php">Bob and Beyond</a></li>
                <li><a href="radio-two.php">Check up</a></li>
                <li><a href="radio-two.php">Freedom inside</a></li>
                <li><a href="radio-two.php">Hot 20</a></li>
                <li class="active"><a href="radio-two.php">Past, Present and Future</a></li>
                <li><a href="radio-two.php">Porridge</a></li>
                <li><a href="radio-two.php">Prison news</a></li>
                <li><a href="radio-two.php">Prime time</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </main><!-- / #content -->

</div>

<?php include('_includes/footer.php'); ?>
