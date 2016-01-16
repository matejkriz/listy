var gulp = require('gulp');
var copy = require('gulp-copy');
var changed = require('gulp-changed');
var config = require('../config').copy;
var htmlreplace = require('gulp-html-replace');

gulp.task('copy:index', [], function() {
  return gulp.src(config.index)
    .pipe(htmlreplace({
      js: {
        src: [
          ['js/require.build.js', 'js/require.js']
        ],
        tpl: '<script data-main="%s" src="%s"></script>'
      },
      cordova: {
        src: null,
        tpl: '<script type="text/javascript" src="cordova.js"></script>\n'
      }
    }))
    .pipe(gulp.dest(config.dest));
});

gulp.task('copy', ['copy:index'], function() {
  return gulp.src(config.src)
    .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(copy(config.dest, {
      prefix: 1
    }));
});
