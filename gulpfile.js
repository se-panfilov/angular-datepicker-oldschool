'use strict';

var gulp = require('gulp'), concat, rename, uglify, jade, sourcemaps, watch, changed,
    ngAnnotate, stylus, nib, minifyHTML, minifyCss, templateCache, mergeStream,
    cssBase64, size, stylish, order, jshint, install, todo;

var src = {
    styles: 'src/templates/**/*.styl',
    jade: 'src/templates/**/*.jade',
    html: 'src/templates/**/*.html',
    js: 'src/*.js',
    coreJs: '/bower_components/x-date-core/dist/x-date-core.min.js'
};

var dest = {
    dist: 'dist',
    src: 'src'
};

gulp.task('install', function () {
    install = install || require("gulp-install");

    gulp.src(['./bower.json', './package.json'])
        .pipe(install());
});

gulp.task('lint', function () {
    jshint = jshint || require('gulp-jshint');
    stylish = stylish || require('jshint-stylish');

    return gulp.src(src)
        .pipe(jshint({
            globalstrict: true,
            strict: false,
            globals: {
                //console: true
            }
        }))
        .pipe(jshint.reporter(stylish));
});

gulp.task('todo', function () {
    todo = require('gulp-todo');

    gulp.src('src/**/*.*')
        .pipe(todo())
        .pipe(gulp.dest('./'));
});

gulp.task('sizes', function () {
    size = size || require('gulp-filesize');

    return gulp.src([
        'dist/**/*.js',
        'dist/**/*.css'
    ]).pipe(size());
});

function makeJade() {
    templateCache = templateCache || require('gulp-angular-templatecache');
    minifyHTML = minifyHTML || require('gulp-minify-html');
    changed = changed || require('gulp-changed');
    jade = jade || require('gulp-jade');

    return gulp.src(src.jade)
        .pipe(changed(dest.dist, {extension: '.html'}))
        .pipe(jade({pretty: false}))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(templateCache({
            module: 'angular-pd.templates',
            standalone: true
        }))
}

function makeJS() {
    ngAnnotate = ngAnnotate || require('gulp-ng-annotate');
    concat = concat || require('gulp-concat');

    return gulp.src([src.js, src.coreJs])
        .pipe(concat('angular-pure-datepicker.js'))
        .pipe(ngAnnotate({remove: true, add: true, single_quotes: true}))
}

function mergeJsWithTemplates(templates, mainJs) {
    mergeStream = mergeStream || require('merge-stream');
    sourcemaps = sourcemaps || require('gulp-sourcemaps');
    uglify = uglify || require('gulp-uglify');
    rename = rename || require('gulp-rename');
    concat = concat || require('gulp-concat');

    return mergeStream(templates, mainJs)
        .pipe(concat('angular-pure-datepicker.js'))
        .pipe(gulp.dest(dest.dist))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({basename: 'angular-pure-datepicker.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest.dist));
}

gulp.task('js', function () {
    var templates = makeJade();
    var mainJs = makeJS();
    return mergeJsWithTemplates(templates, mainJs);
});

gulp.task('stylus', function () {
    cssBase64 = cssBase64 || require('gulp-css-base64');
    minifyCss = minifyCss || require('gulp-minify-css');
    nib = nib || require('nib');
    stylus = stylus || require('gulp-stylus');
    concat = concat || require('gulp-concat');

    return gulp.src(src.styles, {base: 'src'})
        .pipe(concat('angular-pure-datepicker.styl'))
        .pipe(stylus({use: [nib()], compress: true}))
        .pipe(cssBase64({
            baseDir: "img"
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest(dest.dist));
});

gulp.task('watch', function () {
    watch = watch || require('gulp-watch');

    gulp.watch(src.jade, ['js', 'todo']);
    gulp.watch(src.styles, ['stylus', 'todo']);
    gulp.watch(src.coreJs, ['js', 'todo']);
    gulp.watch(src.viewJs, ['js', 'todo']);
});

gulp.task('build', function () {
    gulp.start('stylus');
    gulp.start('js');
});

gulp.task('default', function () {
    gulp.start('build');
    gulp.start('watch');
});