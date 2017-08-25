<?php
$title = 'Timewise';
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
      <li><a href="videos-one.php">Videos by Genre</a></li>
      <li aria-current="page">Timewise</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">

    <div class="browse">
      <div class="browse-panes subsection no-root" data-state="section" data-module="track-click" aria-busy="false">
        <div id="subsection" class="subsection-pane pane" style="">
          <div class="pane-inner a-to-z">
            <h1 tabindex="-1">Timewise</h1>
            <p class="sort-order">A to Z</p>
            <ul>
              <li><a href="video.php">Challenging Beliefs</a></li>
              <li><a href="video.php">Dealing with Criticism</a></li>
              <li><a href="video.php">Getting Perspective</a></li>
              <li><a href="video.php">Getting yourself accross</a></li>
              <li><a href="video.php">Reading Situations</a></li>
              <li><a href="video.php">Seeing how it is</a></li>
              <li><a href="video.php">Staying in control</a></li>
              <li><a href="video.php">Staying on Track</a></li>
              <li><a href="video.php">Understanding what I do</a></li>
            </ul>
          </div>
        </div>
        <div id="section" class="section-pane pane" style="">
          <div class="pane-inner alphabetical" style="">
            <h1 tabindex="-1">Genres</h1>
            <p class="sort-order" style="">A to Z</p>
            <ul>
                <li><a href="#">Breaking Free Online</a></li>
                <li><a href="#">Featured Films</a></li>
                <li><a href="#">Koestler Trust</a></li>
                <li><a href="#">Prison and Probation onbudsman</a></li>
                <li><a href="#">Prison Video Trust</a></li>
                <li><a href="#">Shannon Trust</a></li>
                <li><a href="#">Straightline</a></li>
                <li><a href="#">TED Talks</a></li>
                <li class="active"><a href="#">Timewise</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </main><!-- / #content -->

</div>

<?php include('_includes/footer.php'); ?>
