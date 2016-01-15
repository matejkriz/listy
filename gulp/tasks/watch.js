var gulp     = require('gulp');
var config   = require('../config');

gulp.task('watch', [], function() {
  gulp.watch(config.jshint.src,   ['requirejs:build']);
  gulp.watch(config.sass.watch,   ['sass']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(config.jshint.src, ['jshint']);
  gulp.watch(config.copy.src, ['copy']);
});
