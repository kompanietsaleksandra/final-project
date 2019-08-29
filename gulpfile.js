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
    cache        = require('gulp-cache'),
    imagemin     = require('gulp-imagemin'),
    svgSprite    = require('gulp-svg-sprites'),
    svgmin       = require('gulp-svgmin'),
    cheerio      = require('gulp-cheerio'),
    replace      = require('gulp-replace');

gulp.task('browser-sync', ['fonts', 'styles', 'scripts', 'common', 'html', 'svgSprite', 'images'], function() {
    browserSync.init({
        server: {
            baseDir: "./app"
        },
        notify: false
    });
});

gulp.task('svgSprite', function () {
    return gulp.src('./dev/img/svg/**/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
          run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
          },
          parserOptions: {xmlMode: false}
        }))
        .pipe(replace('&gt;', '>'))
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
        './dev/js/libs/jquery/jquery-3.4.1.js',
        './dev/js/libs/swiper/swiper.min.js'
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

gulp.task('images', function(){
    return gulp.src([
        './dev/img/**/*.+(png|jpg|jpeg)',
        '!/dev/img/svg/**/*.svg'
    ])
    // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('./app/img/'))
});

gulp.task('fonts', function() {
    return gulp.src([
        './dev/fonts/**/*'
    ])
        .pipe(gulp.dest('./app/fonts/'));
});

gulp.task('watch', function () {
    gulp.watch('./dev/scss/**/*.scss', ['styles']);
    gulp.watch('./dev/js/libs/**/*.js', ['scripts']);
    gulp.watch('./dev/js/common.js', ['common']);
    gulp.watch('./dev/*.html', ['html']);
    gulp.watch('./dev/img/svg/**/*.svg', ['svgSprite']);
    gulp.watch('./dev/img/**/*.+(png|jpg|jpeg)', ['images']);
    gulp.watch('./dev/js/*.js').on("change", browserSync.reload);
    gulp.watch('./dev/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
