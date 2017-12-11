<!DOCTYPE html>
<!--[if gt IE 8]><!--><html lang="en"><!--<![endif]-->
<head>
  <meta charset="utf-8" />
  <title>
    <?php if (isset($title)): echo $title; else: echo "The Hub"; endif; ?>
  </title>

  <!--[if gt IE 8]><!--><link href="/hmppsAssets/css/govuk-template.css?0.22.3" media="screen" rel="stylesheet" /><!--<![endif]-->
  <link href="/hmppsAssets/css/govuk-template-print.css?0.22.3" media="print" rel="stylesheet" />
  <!--[if gte IE 9]><!--><link href="/hmppsAssets/css/fonts.css?0.22.3" media="all" rel="stylesheet" /><!--<![endif]-->

  <link rel="shortcut icon" href="/hmppsAssets/img/favicon.ico?0.22.3" type="image/x-icon" />
  <link rel="mask-icon" href="/hmppsAssets/img/gov.uk_logotype_crown.svg?0.22.3" color="#0b0c0c">
  <link rel="apple-touch-icon" sizes="180x180" href="/hmppsAssets/img/apple-touch-icon-180x180.png?0.22.3">
  <link rel="apple-touch-icon" sizes="167x167" href="/hmppsAssets/img/apple-touch-icon-167x167.png?0.22.3">
  <link rel="apple-touch-icon" sizes="152x152" href="/hmppsAssets/img/apple-touch-icon-152x152.png?0.22.3">
  <link rel="apple-touch-icon" href="/hmppsAssets/img/apple-touch-icon.png?0.22.3">
  <meta name="theme-color" content="#0b0c0c" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="og:image" content="/hmppsAssets/img/opengraph-image.png?0.22.3">

  <!--[if gt IE 8]><!--><link href="/hmppsAssets/css/hmpps.css"  rel="stylesheet" type="text/css"><!--<![endif]-->
</head>

<body class="epub">
  <script>document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');</script>
    <main class="ereader js-ereader" role="main" tabindex="0">
        <button role="button" class="js-ereader-prev ereader__prev" type="button" name="button">Prev</button>
        <div class="ereader__area js-ereader-area"></div>
        <button role="button" class="js-ereader-next ereader__next" type="button" name="button">Next</button>
    </main>
</body>

<script src="/hmppsAssets/js/src/third-party/lib/jszip.min.js"></script>
<script src="/hmppsAssets/js/src/third-party/lib/epub.min.js"></script>
<script src="/hmppsAssets/js/src/third-party/lib/mime-types.js"></script>

<script>

    
    function openBook() {
        var htmlElement = document.getElementsByTagName("html")[0];
        htmlElement.style.height = '100%';
        document.body.style.height = '100%';
        htmlElement.style.overflow = 'hidden';

        //source to be provided by dev below
        var src = '_dummy/Books/epub/Metamorphosis-jackson.epub';
        var next = document.getElementsByClassName('js-ereader-next')[0];
        var prev = document.getElementsByClassName('js-ereader-prev')[0];
        var area = document.getElementsByClassName('js-ereader-area')[0];

        var Book = ePub(src);
        var rendered = Book.renderTo(area);
        rendered.then(function () {
            Book.open(src);
        });
    
        prev.addEventListener('click', function () {
            Book.prevPage();
        });
        next.addEventListener('click', function () {
            Book.nextPage();
        });

        var keylock = false;

        document.body.onkeydown = function (e) {
            if(e.keyCode == 37) { 
                console.log('next')	
                if(Book.metadata.direction === "rtl") {
                    Book.nextPage();
                } else {
                    Book.prevPage();
                }

                //prev.addClass("active");

                keylock = true;
                setTimeout(function(){
                    keylock = false;
                    //prev.removeClass("active");
                }, 100);

                e.preventDefault();
            }
            if(e.keyCode == 39) {
                console.log('prev')	
                if(Book.metadata.direction === "rtl") {
                    Book.prevPage();
                } else {
                    Book.nextPage();
                }
                
                //next.addClass("active");

                keylock = true;
                setTimeout(function(){
                    keylock = false;
                    //next.removeClass("active");
                }, 100);

                e.preventDefault();
            }
        };
        // return {
        //     "arrowKeys" : arrowKeys
        // };
    
        
    }
    window.onload = openBook();

   
</script>

