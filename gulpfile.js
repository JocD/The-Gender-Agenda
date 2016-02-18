// loads various gulp modules
var gulp = require('gulp');
var util = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var count = require('gulp-count');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');

var prod = !!util.env.production;

gulp.task('default', function () {
    gulp.start(['js', 'css', 'img']);
});

gulp.task('js', function () {
    gulp.src(
        [
            './public/js/jquery.2.2.0.min.js',
            './semantic/dist/semantic.min.js',
            './public/js/attach_semantic-ui.js'
        ])
        .pipe(count('## js-files selected'))
        .pipe(concat('app.min.js'))
        .pipe(prod ? uglify() : util.noop())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('css', function () {
    var css = gulp.src([
        './semantic/dist/semantic.min.css',
        './public/css/web-fonts.css',
        './public/css/style.css'
    ])
    .pipe(count('## css-files selected'))
    .pipe(concat('app.min.css'))
    .pipe(prod ? minifyCss() : util.noop())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('img', function () {
    if(prod) {
        gulp.src(
            [
                './public/img/**/*.jpg',
                './public/img/**/*.png',
                './public/img/**/*.gif',
                './public/img/**/*.svg'
            ], {base: './'})
            .pipe(count('## img-files selected'))
            .pipe(imagemin({progressive: true}))
            .pipe(gulp.dest('./'));
    }
});