const gulp 			= require('gulp');
const $ 			= require('gulp-load-plugins')();
const uglify 		= require('gulp-uglify');
const sourcemaps 	= require('gulp-sourcemaps');
const babel 		= require('gulp-babel');
const plumber 		= require('gulp-plumber');
const notify 		= require('gulp-notify');
const browserSync   = require('browser-sync').create();
const eslint        = require('gulp-eslint');
const header        = require('gulp-header');

gulp.task('lint', function() {
    return gulp.src('source/imageTools.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build-es5', function() {
    const pkg = require('./package.json');
    const banner = [
        '/**',
        ' * <%= pkg.description %> v<%= pkg.version %> | <%= pkg.license %>',
        ' * <%= pkg.homepage %>',
        ' */',
        ''
    ].join('\n');

    return gulp.src('source/imageTools.js')
        .pipe(plumber({
            errorHandler: notify.onError('JS: <%= error.message %>')
        }))
        .pipe(sourcemaps.init())
		.pipe(babel({
            presets: ['es2015'],
            plugins: ['iife-wrap']
        }))
        .pipe(uglify())
        .pipe($.rename('imageTools.es5.min.js'))
		.pipe(header(banner, { pkg: pkg }))
		.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
        .pipe(notify({
            message: 'JS compilation complete: <%= file.relative %>',
            onLast: true
        }));
});

gulp.task('build', function() {
    return gulp.src('source/imageTools.js')
        .pipe(plumber({
            errorHandler: notify.onError('JS: <%= error.message %>')
        }))
        .pipe(sourcemaps.init())
		.pipe(uglify())
        .pipe($.rename('imageTools.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
        .pipe(notify({
            message: 'JS compilation complete: <%= file.relative %>',
            onLast: true
        }));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './examples/',
            directory: true,
            routes: {
                '/dist': './dist'
            }
        },
        files: ['dist/imageTools.es5.min.js', 'examples/*'],
        open: false
    });
});

gulp.task('default', ['lint', 'build-es5', 'browser-sync'], function() {
    gulp.watch('source/imageTools.js', ['lint', 'build-es5']);

    // gulp.watch('dist/imageTools.es5.min.js').on('change', browserSync.reload);
    // gulp.watch('examples/*').on('change', browserSync.reload);
});
