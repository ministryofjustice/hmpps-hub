<?php
$title = 'Content page';
include('_includes/head.php'); ?>

<?php include('_includes/header.php'); ?>

<div id="global-header-bar"></div>

<div class="site-wrapper">
  <div class="breadcrumbs">
    <ol>
      <li><a href="index.php">Home</a></li>
      <li>Content Page</li>

      <li aria-current="page">May</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">
  <div class="grid-row">
    <div class="column-two-thirds">
      <div class="pub-c-title">
        <h1 class="pub-c-title__text">
          Page title
        </h1>
      </div>
      <div class="content">
        <h2>Title</h2>
        <h3>Title</h3>
        <h4>Title</h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <ul>
          <li><a href="">test</a></li>
          <li><a href="">test</a></li>
          <li><a href="">test</a></li>
          <li><a href="">test</a></li>
        </ul>
        <ol>
          <li>test</li>
          <li>test</li>
          <li>test</li>
          <li>test</li>
        </ol>
      </div>
    </div>
    <div class="column-third add-title-margin">
      <aside class="related-content" role="complementary">
        <h2 >
          Title
        </h2>
        <nav role="navigation">
          <ul class="list">
              <li>
              <a href="#test">link</a>
              </li>
              <li>
              <a href="#test">link</a>
              </li>
              <li>
              <a href="#test">link</a>
              </li>
              <li>
              <a href="#test">link</a>
              </li>
          </ul>
        </nav>
      </aside>
    </div>
  </div>



  </main><!-- / #content -->

</div>

<?php include('_includes/footer.php'); ?>
