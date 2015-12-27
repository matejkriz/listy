var gulp         = require('gulp');
var gettext      = require('gulp-angular-gettext');
var config       = require('../config').lang;

gulp.task('gettext:extract', function () {
    return gulp.src(config.extractSrc)
        .pipe(gettext.extract('template.pot'))
        .pipe(gulp.dest(config.dest));
});

gulp.task('gettext:compile', ['gettext:extract'], function () {
    return gulp.src(config.compileSrc)
        .pipe(gettext.compile({
            format: 'javascript'
        }))
        .pipe(gulp.dest(config.dest));
});

gulp.task('lang', ['gettext:extract', 'gettext:compile']);
