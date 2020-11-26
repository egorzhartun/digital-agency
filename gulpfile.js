const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

const terser = require('gulp-terser');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();

function clear() {
    return src('./assets/*', {
            read: false
        })
        .pipe(clean());
}

function js(){
    return src('./src/js/*.js')
        .pipe(terser())
        .pipe(dest('./assets/js/'));
}

function css() {
    const source = './src/scss/main.scss';

    return src(source)
        .pipe(changed(source))
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(cssnano())
        .pipe(dest('./assets/css/'))
        .pipe(browsersync.stream());
}

function img() {
    return src('./src/img/*')
        .pipe(imagemin())
        .pipe(dest('./assets/img'));
}

function watchFiles() {
    watch('./src/scss/*', css);
    watch('./src/js/*', js);
    watch('./src/img/*', img);
}

function browserSync() {
    browsersync.init({
        server: {
            baseDir: './'
        },
        port: 3000
    });
}

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(js, css, img));