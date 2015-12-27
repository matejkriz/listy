var dest = "./www";
var src = './app';

module.exports = {
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: dest
        }
    },
    jshint: {
        src: src + '/js/**/*.js',
        reporter: 'jshint-stylish'
    },
    sass: {
        src: src + "/scss/ionic.app.scss",
        watch: src + "/scss/**/*.scss",
        dest: dest + "/css",
        settings: {
            imagePath: 'images' // Used by the image-url helper
        }
    },
    images: {
        src: src + "/img/**",
        dest: dest + "/img"
    },
    copy: {
        src: [
            src + "/lib/**",
            src + "/locale/**",
            src + "/templates/**/*.html",
            src + "/index.html"
        ],
        dest: dest
    },
    production: {
        cssSrc: dest + '/css/*.css',
        cssDest: dest + '/css',
        jsSrc: dest + '/js/*.js',
        jsDest: dest + '/js'
    },
    lang: {
        extractSrc: [
            src + '/templates/**/*.html',
            src + '/index.html',
            src + '/js/**/*.js'
        ],
        compileSrc: src + '/translations/*.po',
        dest: src + '/translations'
    }
};
