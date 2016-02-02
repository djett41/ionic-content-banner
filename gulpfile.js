var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var karma = require('karma').server;
var uglify = require('gulp-uglify');

var karmaConf = require('./karma.conf.js');
var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['js/**/*.js'],
  dist: './dist'
};

gulp.task('default', ['karma']);
gulp.task('dist', ['karma', 'scripts']);

gulp.task('scripts', function() {
  return gulp.src([
    'js/ionic.content.banner.js',
    'js/ionic.content.banner.directive.js',
    'js/ionic.content.banner.service.js'
  ])
    .pipe(concat('ionic.content.banner.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/main.scss')
    .pipe(sass({ errLogToConsole: true }))
    .pipe(rename({  basename: 'ionic.content.banner' }))
    .pipe(gulp.dest(paths.dist))
    .pipe(minifyCss({ keepSpecialComments: 0 }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.dist))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('karma', function(done) {
  karmaConf.singleRun = true;
  karma.start(karmaConf, done);
});

gulp.task('karma-watch', function(done) {
  karmaConf.singleRun = false;
  karma.start(karmaConf, done);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
