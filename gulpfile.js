const
  gulp         = require('gulp'),
  sass         = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS     = require('gulp-clean-css'),
  rename       = require('gulp-rename'),
  htmlmin      = require('gulp-htmlmin'),
  browserSync  = require('browser-sync').create(),
  concat       = require('gulp-concat'),
  uglify       = require('gulp-uglify'),
  svgSprite    = require('gulp-svg-sprites'),
  svgmin       = require('gulp-svgmin');

gulp.task('browser-sync', ['styles', 'scripts', 'common', 'html', 'svgSprite'], function() {
  browserSync.init({
    server: {
      baseDir: "./app"
    },
    notify: false
  });
});

gulp.task('svgSprite', function () {
  return gulp.src('./dev/svg/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(svgSprite({
        mode: "symbols",
        preview: false,
        selector: "waxom_%f",
        svg: {
          symbols: 'sprite.svg'
        }
      }
    ))
    .pipe(gulp.dest('./app/img/svg/'));
});

gulp.task('styles', function () {
  return gulp.src('./dev/scss/main.scss')
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths
    }).on('error', sass.logError))
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});


gulp.task('scripts', function() {
  return gulp.src([
    './dev/js/libs/jquery/jquery-3.4.1.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js/'));
});

gulp.task('common', function() {
  return gulp.src([
    './dev/js/common.js'
  ])
    .pipe(concat('common.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js/'));
});

gulp.task('html', function() {
  return gulp.src([
    './dev/*.html'
  ])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('watch', function () {
  gulp.watch('./dev/scss/**/*.scss', ['styles']);
  gulp.watch('./dev/js/libs/**/*.js', ['scripts']);
  gulp.watch('./dev/js/common.js', ['common']);
  gulp.watch('./dev/*.html', ['html']);
  gulp.watch('./dev/js/*.js').on("change", browserSync.reload);
  gulp.watch('./dev/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
