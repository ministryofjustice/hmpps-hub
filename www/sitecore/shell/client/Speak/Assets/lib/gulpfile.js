var gulp = require('gulp');
var rename = require( 'gulp-rename' );
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('concat', function() {
  gulp.src([
  'core/2.0/deps/handlebars.js',
  'core/2.0/globalize.js',
  'core/2.0/sitecore.js',
  'ui/2.0/deps/knockout-3.0.0.js',
  'ui/2.0/deps/jquery-2.1.1.js',
  'ui/2.0/deps/underscore.1.6.0.js',
  'ui/1.1/deps/jQueryUI/jquery-ui-1.11.4.custom.js',
  'ui/2.0/deps/bootstrap.js',
  'ui/2.0/deps/backbone.1.1.1.js',
  'ui/2.0/scKoPresenter.js'
  ])
	.pipe( concat( 'sitecore.packed.js' ) )
    .pipe(gulp.dest('core/2.0/'))
});

gulp.task('compress', ['concat'], function () {
  gulp.src(['core/2.0/sitecore.packed.js'])
    .pipe(uglify())
    .pipe(rename('sitecore.packed.min.js'))
    .pipe(gulp.dest('core/2.0/'))
});


gulp.task('default', ["compress"]);