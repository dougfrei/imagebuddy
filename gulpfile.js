const gulp 			= require('gulp');
const $ 			= require('gulp-load-plugins')();
const uglify 		= require('gulp-uglify');
const sourcemaps 	= require('gulp-sourcemaps');
const babel 		= require('gulp-babel');
const plumber 		= require('gulp-plumber');
const jshint 		= require('gulp-jshint');
const notify 		= require('gulp-notify');
const browserSync   = require('browser-sync').create();


gulp.task('build-es5', function() {
    return gulp.src('source/imageTools.js')
        .pipe(plumber({
            errorHandler: notify.onError('JS: <%= error.message %>')
        }))
        .pipe(jshint({
            esversion: 6,
            browser: true
        }))
        .pipe(jshint.reporter('jshint-stylish', {
            beep: true
        }))
        .pipe(sourcemaps.init())
		.pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe($.rename('imageTools.es5.min.js'))
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
        .pipe(jshint({
            esversion: 6,
            browser: true
        }))
        .pipe(jshint.reporter('jshint-stylish', {
            beep: true
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

gulp.task('default', ['build-es5', 'browser-sync'], function() {
    gulp.watch('source/imageTools.js', ['build-es5']);

    // gulp.watch('dist/imageTools.es5.min.js').on('change', browserSync.reload);
    // gulp.watch('examples/*').on('change', browserSync.reload);
});
