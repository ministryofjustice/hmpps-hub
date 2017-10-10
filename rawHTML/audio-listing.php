<?php
$title = 'Audio Listing Page';
include('_includes/head.php'); ?>

<?php include('_includes/header.php'); ?>

<div id="global-header-bar"></div>

<div class="site-wrapper">
  <div class="breadcrumbs">
    <ol>
      <li><a href="index.php">Home</a></li>
        <li aria-current="page">Audio Listings</li>
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
        <nav role="navigation" class="grid-row part-navigation" aria-label="Audio Listings">
          <ul class="column-one-third no-gutter list-bare">
              <li>
                <a href="#">January</a>
              </li>
              <li>
                February
              </li>
              <li>
                <a href="#">March</a>
              </li>
              <li>
                <a href="#">April</a>
              </li>
          </ul>
          <ul class="column-one-third no-gutter list-bare" start="5">
              <li>
                <a href="#">May</a>
              </li>
              <li>
                <a href="#">June</a>
              </li>
              <li>
                <a href="#">July</a>
              </li>
              <li>
                <a href="#">August</a>
              </li>
          </ul>
          <ul class="column-one-third no-gutter list-bare" start="10">
              <li>
                <a href="#">September</a>
              </li>
              <li>
                <a href="#">October</a>
              </li>
              <li>
                <a href="#">November</a>
              </li>
              <li>
                <a href="#">December</a>
              </li>
          </ul>
        </nav>
      </aside>
      <div class="list-links">
        <div class="column-half no-gutter">
          <ul>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
          </ul>
        </div>
        <div class="column-half no-gutter">
          <ul>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
            <li><a href="">Lorem ipsum dolor sit amet.</a></li>
          </ul>
        </div>
      </div>
      <nav class="pub-c-pagination" role="navigation" aria-label="Pagination">
        <ul class="pub-c-pagination__list">
            <li class="pub-c-pagination__item pub-c-pagination__item--previous">
              <a href="#" class="pub-c-pagination__link" rel="prev">
                <span class="pub-c-pagination__link-title">
                  <svg class="pub-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                    <path fill="currentColor" d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
                  </svg>
                  Previous
                </span>
                  <span class="visually-hidden">:</span>
                  <span class="pub-c-pagination__link-label">January</span>
              </a>
            </li>
            <li class="pub-c-pagination__item pub-c-pagination__item--next">
              <a href="#" class="pub-c-pagination__link" rel="next">
                <span class="pub-c-pagination__link-title">
                  Next
                  <svg class="pub-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
                    <path fill="currentColor" d="m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
                  </svg>
                </span>
                  <span class="visually-hidden">:</span>
                  <span class="pub-c-pagination__link-label">March</span>
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
