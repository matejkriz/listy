var gulp = require('gulp');
var config = require('../config').server;
var connect = require('gulp-connect');
var yargs = require('yargs');

gulp.task('server', 'Serve app on localhost:{port}', function() {
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
