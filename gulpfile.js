var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var minifyHtml = require('gulp-minify-html');
var args = require('yargs').argv;
var angularTemplatecache = require('gulp-angular-templatecache');
var useref = require('gulp-useref');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglifyes');
var processhtml = require('gulp-processhtml')
var concat = require('gulp-concat');
var addStream = require('add-stream');
var es = require('event-stream');
var fs = require('fs');
var babel = require('gulp-babel');
var gulpIgnore = require('gulp-ignore');
var cachebust = require('gulp-cache-bust');
var del = require('del');
var series = require('stream-series');
var inject = require('gulp-inject');
var clip = require('gulp-clip-empty-files');
var naturalSort = require('gulp-natural-sort');
var angularOrder = require('gulp-angular-order');
var angularFilesort = require('gulp-angular-filesort');
var $ = require('gulp-load-plugins')({
  lazy: true
});

var config = {
  js: 'js/**/*.js',
  images: 'images/*.*',
  fonts: 'fonts/*.*',
  html: 'templates/*.html',
  temp: 'temp/'
}

var dist = {
  path: 'dist-ui/',
  images: 'images/',
  fonts: 'fonts/'
}

gulp.task('build', ['copy', 'uglify-gbrs', 'minify-gbrs', 'templatecache', 'process-index', 'inject', 'cache-bust', 'clean-code'], function () {
  del('/dist-ui');
});

gulp.task('copy', [], function () {

  return gulp.src([
    '*',
    'app/**',
    'images/**',
    'lib/**',
    'styles/**',
], {
      base: '.'
    })
    .pipe(gulp.dest('dist-ui/'));
});

gulp.task('uglify-gbrs', ['copy'], function () {
  return gulp.src(['dist-ui/app/**/*.js']).pipe(uglify({
      mangle: false,
      ecma: 6,
      compress: {
        dead_code: true,
        drop_debugger: true,
        drop_console: true
      },
    }))
    .pipe(gulp.dest('dist-ui/app'));
});

//'uglify-lib','minify-lib'
gulp.task('minify-gbrs', ['copy', 'uglify-gbrs'], function () {
  gulp.src('dist-ui/app/**/*.js')
    .pipe(naturalSort())
    .pipe(angularFilesort())
    .pipe(concat('gbrsv2.min.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('dist-ui/js/'));
});
//'clean-code'
gulp.task('templatecache', ['copy', 'uglify-gbrs', 'minify-gbrs'], function () {
  console.log('Creating an AngularJS $templateCache');

  return gulp
    .src('app/**/*.html')
    .pipe($.if(args.verbose, $.bytediff.start()))
    .pipe($.minifyHtml({
      empty: true
    }))
    .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
    .pipe($.angularTemplatecache(
      'templates.js', {
        module: 'gbrs.home',
        root: 'app/',
        standalone: false
      }
    ))
    .pipe(gulp.dest('dist-ui/.tmp/'));
});

gulp.task('process-index', ['copy', 'uglify-gbrs', 'minify-gbrs', 'templatecache'], function () {
  return gulp.src('dist-ui/index.html')
    .pipe(processhtml())
    .pipe(gulp.dest('dist-ui/'));
});

gulp.task('inject', ['copy', 'uglify-gbrs', 'minify-gbrs', 'templatecache', 'process-index'], function () {
  console.log("Injecting $templateCache to gbrs.min.js");
  fs.createReadStream('dist-ui/js/gbrsv2.min.js')
    .pipe(addStream(fs.createReadStream('./dist-ui/.tmp/templates.js')))
    .pipe(fs.createWriteStream('dist-ui/js/gbrs.min.js'));
  //  console.log("injecting app styles to index");
  //  return gulp.src('dist-ui/index.html')
  //    .pipe(inject(gulp.src('./styles/*.css')))
  //    .pipe(gulp.dest('dist-ui/'));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['copy', 'uglify-gbrs', 'minify-gbrs', 'templatecache', 'process-index', 'inject'], function () {
  return gulp
    .src('./dist-ui/images/**/*.*')
    .pipe($.imagemin({
      optimizationLevel: 4
    }))
    .pipe(gulp.dest('dist-ui/images'));
});

gulp.task('cache-bust', ['copy', 'uglify-gbrs', 'minify-gbrs', 'templatecache', 'process-index', 'inject', 'images'], function () {
  return gulp.src('dist-ui/index.html')
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest('dist-ui/'));
});

gulp.task('clean', function () {
  del('dist-ui/**/*');
  del('dist-ui/.tmp/*');
});

gulp.task('clean-code', ['copy', 'uglify-gbrs', 'minify-gbrs', 'templatecache', 'process-index', 'inject', 'images', 'cache-bust'], function (done) {
  //  var files = [].concat(
  //    //'dist-ui/.tmp' + '**/*.js',
  //    'dist-ui/app/' + '**/*.js',
  //    'dist-ui/app/' + '**/*.html'
  //  );
  //  console.log('Cleaning: ' + files);
  //  del(files, done);
  del('dist-ui/app');
  del('dist-ui/js/gbrsv2.min.js');
  del('dist-ui/.tmp');
  del('dist-ui/dist-ui');
});

//gulp.task('uglify-lib', ['copy', 'uglify-gbrs'], function () {
//  return gulp.src('dist-ui/lib/**/*.js')
//    .pipe($.plumber())
//    .pipe($.uglify())
//    .pipe(clip())
//    .pipe(gulp.dest('dist-ui/lib/'));
//});
//
//
//gulp.task('minify-lib', ['copy', 'uglify-gbrs', 'uglify-lib'], function () {
//  return gulp.src('dist-ui/lib/**/*.js')
//    .pipe($.plumber())
//    .pipe(uglify())
//    .pipe(naturalSort())
//    .pipe(angularFilesort())
//    .pipe(concat('lib.min.js'))
//    .pipe(ngAnnotate())
//    .pipe(clip())
//    .pipe(gulp.dest('dist-ui/js/'));
//});

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
  var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
  return data.fileName + ' went from ' +
    (data.startSize / 1000).toFixed(2) + ' kB to ' +
    (data.endSize / 1000).toFixed(2) + ' kB and is ' +
    formatPercent(1 - data.percent, 2) + '%' + difference;
}
