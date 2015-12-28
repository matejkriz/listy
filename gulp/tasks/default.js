var gulp = require('gulp');

gulp.task('default', ['jshint', 'requirejs:build', 'sass', 'images', 'copy', 'watch']);
