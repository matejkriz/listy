var gulp = require('gulp');
var copy = require('gulp-copy');
var changed = require('gulp-changed');
var config = require('../config').copy;

gulp.task('copy', function() {
    return gulp.src(config.src)
        .pipe(changed(config.dest)) // Ignore unchanged files
        .pipe(copy(config.dest, {
            prefix: 1
        }));
});
