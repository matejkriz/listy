var gulp = require('gulp');
var config = require('../config').connect;
var connect = require('gulp-connect');
var yargs = require('yargs');

gulp.task('connect', 'Serve app on localhost:{port}', function() {
  var argv = yargs.argv;
  connect.server({
    root: [config.root],
    port: argv.port || config.defaultPort,
    livereload: config.livereload
  });
}, {
  options: {
    'port': 'default ' + config.defaultPort
  }
});
