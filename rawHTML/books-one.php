<?php
$title = 'Books';
include('_includes/head.php'); ?>
<?php include('_includes/header.php'); ?>

<div id="global-header-bar"></div>

<div class="site-wrapper">
  <div class="breadcrumbs">
    <ol>
      <li><a href="index.php">Home</a></li>
      <li aria-current="page">Books</li>
    </ol>
  </div>
  <main class="elements-index root-index" id="content" role="main" tabindex="-1">
    <h1 class="heading-xlarge">Books</h1>

    <div class="image-grid">
      <div class="grid-row">
        <div class="column-one-third">
          <div class="image-grid-item">
            <a href="books-two.php"><img src="_dummy/img/entertainment.png" alt="">
            <h2 class="heading-medium">Entertainment</h2>
            </a>
          </div>
        </div>
        <div class="column-one-third">
          <div class="image-grid-item">
            <a href="books-two.php"><img src="_dummy/img/education.png" alt="">
            <h2 class="heading-medium">Education</h2>
            </a>
          </div>
        </div>
      </div>
    </div>
    </main><!-- / #content -->

</div>

<?php include('_includes/footer.php'); ?>
