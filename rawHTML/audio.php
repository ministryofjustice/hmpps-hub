<?php
$title = 'Radio by Genre';
include('_includes/head.php'); ?>

<?php include('_includes/header.php'); ?>

<div id="global-header-bar"></div>

<div class="site-wrapper">
  <div class="breadcrumbs">
    <ol>
      <li><a href="index.php">Home</a></li>
      <li><a href="radio-one.php">Radio by Genre</a></li>
      <li><a href="radio-two.php">Past, Present and Future</a></li>
      <li aria-current="page">May</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">
  <div class="grid-row">
    <div class="column-two-thirds">
      <div class="pub-c-title">
        <h1 class="pub-c-title__text ">
          Bob and Beyond 22/01/17
        </h1>
      </div>
      <div class="audio-player-wrap">
        <audio controls id="audio-player" class="video-js audio-player vjs-default-skin" controls preload="auto">
          <source src="http://digital-hub-dev.northeurope.cloudapp.azure.com:11002/sites/default/files/audio/2017-02/170122%20Bob%20and%20Beyond.mp3" type="audio/mp3">
          <p class="vjs-no-js">
            To listen to this audio please enable JavaScript, and consider upgrading to a web browser that
            <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
          </p>
        </audio>
      </div>
      <div class="content">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
      <div class="more-link">
        <h2 class="heading-large"><a href="#">Show previous episodes ></a></h2>
      </div>
    </div>
    <div class="column-third add-title-margin">
      <aside class="related-content" data-module="track-click" role="complementary">
        <h2>
          More Past, Present and Future
        </h2>
        <nav role="navigation">
          <ul class="list">
              <li>
              <a href="#test">more episodes</a>
              </li>
              <li>
              <a href="#test">more episodes</a>
              </li>
              <li>
              <a href="#test">more episodes</a>
              </li>
              <li>
              <a href="#test">more episodes</a>
              </li>
          </ul>
        </nav>
      </aside>
    </div>
  </div>



  </main><!-- / #content -->

</div>

<?php include('_includes/footer.php'); ?>
