var dest = './www';
var src = './app';

module.exports = {
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: dest
        }
    },
    copy: {
        index: src + '/index.html',
        src: [
            src + '/lib/**',
            src + '/locale/**',
            src + '/templates/**/*.html',
            src + '/css/**'
        ],
        dest: dest
    },
    images: {
        src: src + '/img/**',
        dest: dest + '/img'
    },
    jshint: {
        src: src + '/js/**/*.js',
        reporter: 'jshint-stylish'
    },
    lang: {
        extractSrc: [
            src + '/templates/**/*.html',
            src + '/index.html',
            src + '/js/**/*.js'
        ],
        compileSrc: src + '/translations/*.po',
        dest: src + '/translations'
    },
    production: {
        cssSrc: dest + '/css/*.css',
        cssDest: dest + '/css',
        jsSrc: dest + '/js/*.js',
        jsDest: dest + '/js'
    },
    requirejs: {
      baseUrl: src + '/js',
      mainConfigFile: src + '/js/require.config.js',
      name: 'require.config',
      out: 'require.build.js',
      shim: {
      //     main: {
      //         deps: ['html_template']
      //     }
      },
      dest: dest + '/js'
    },
    sass: {
        src: src + '/scss/ionic.app.scss',
        watch: src + '/scss/**/*.scss',
        dest: src + '/css',
        settings: {
            imagePath: 'images' // Used by the image-url helper
        }
    }
};
