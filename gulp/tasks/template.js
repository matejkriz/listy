var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');

gulp.task('templates:html', function() {
    return gulp.src('app/js/modules/**/templates/*.html')
        .pipe(minifyHTML({
            quotes: true,
            empty: true
        }))
        .pipe(templateCache('html_template.js', {
            module: 'html_template',
            standalone: true,
            root: 'js/modules/'
        }))
        .pipe(gulp.dest('app/js/'));
});
