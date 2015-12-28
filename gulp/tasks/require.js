var gulp = require('gulp');
var rjs = require('gulp-requirejs');
var config = require('../config').requirejs;

gulp.task('requirejs:build', ['copy:require'], function() {
  rjs({
      baseUrl: config.baseUrl,
      mainConfigFile: config.mainConfigFile,
      name: config.name,
      out: config.out,
      shim: config.shim
    }).on('error', function(err) {
      console.log(err.message);
    })
    .pipe(gulp.dest(config.dest));
});

gulp.task('copy:require', function() {
  return gulp.src(['node_modules/requirejs/require.js'])
    .pipe(gulp.dest(config.dest));
});
