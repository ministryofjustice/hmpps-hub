<?php
$title = 'Content page';
include('_includes/head.php'); ?>

<?php include('_includes/header.php'); ?>

<div id="global-header-bar"></div>

<div class="site-wrapper">
  <div class="breadcrumbs">
    <ol>
      <li><a href="index.php">Home</a></li>
        <li aria-current="page">Content Page</li>
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
      <aside class="part-navigation-container" role="complementary">
        <nav role="navigation" class="grid-row part-navigation" aria-label="Pages in this guide">
          <ol class="column-half">
              <li>
                <a href="#"> Your computer (netbook)</a>
              </li>
              <li>
                <a href="#">Lorem ipsum dolor sit amet.</a>
              </li>
              <li>
                <a href="#">Lorem ipsum dolor sit amet.</a>
              </li>
              <li>
                <a href="#">Lorem ipsum dolor sit amet.</a>
              </li>
          </ol>
          <ol class="column-half" start="5">
              <li>
                <a href="#">Lorem ipsum dolor sit amet.</a>
              </li>
              <li>
                <a href="#">Lorem ipsum dolor sit amet.</a>
              </li>
              <li>
                Lorem ipsum dolor sit amet.
              </li>
              <li>
                <a href="#">Lorem ipsum dolor sit amet.</a>
              </li>
          </ol>
        </nav>
      </aside>
      <div class="content">

        <!-- dev note the h2 needs to be created on the creation of the related link above -->
        <!-- dev note no H1s allowed in content area -->
        <h2>1. Your computer (netbook) H2</h2>

        <h3>Title H3</h3>
        <h4>Title H5</h4>
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
        <strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, iure!</strong>
        <i>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, reprehenderit?</i>
        <p><i><strong>Lorem ipsum dolor sit amet.</strong></i></p>
        <img src="_dummy/img/books.png" alt="">
      </div>
      <nav class="pub-c-pagination" role="navigation" aria-label="Pagination">
        <ul class="pub-c-pagination__list">
            <li class="pub-c-pagination__item pub-c-pagination__item--previous">
              <a href="/universal-credit/your-responsibilities" class="pub-c-pagination__link" rel="prev">
                <span class="pub-c-pagination__link-title">
                  <svg class="pub-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                    <path fill="currentColor" d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
                  </svg>
                  Previous
                </span>
                  <span class="visually-hidden">:</span>
                  <span class="pub-c-pagination__link-label">Your responsibilities</span>
              </a>
            </li>
            <li class="pub-c-pagination__item pub-c-pagination__item--next">
              <a href="/universal-credit/other-financial-support" class="pub-c-pagination__link" rel="next">
                <span class="pub-c-pagination__link-title">
                  Next
                  <svg class="pub-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                    <path fill="currentColor" d="m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
                  </svg>
                </span>
                  <span class="visually-hidden">:</span>
                  <span class="pub-c-pagination__link-label">Other financial support</span>
              </a>
            </li>
        </ul>
      </nav>
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
