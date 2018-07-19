/* global require */

const gulp 			= require('gulp');
const plumber 		= require('gulp-plumber');
const notify 		= require('gulp-notify');
const browserSync   = require('browser-sync').create();
const eslint        = require('gulp-eslint');
const webpack		= require('webpack');
const webpackStream	= require('webpack-stream');
const webpackConfig	= require('./webpack.config.js');

gulp.task('lint', function() {
	return gulp.src('source/ImageBuddy.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('build', function() {
	return gulp.src('source/ImageBuddy.js')
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(webpackStream(webpackConfig, webpack))
		.pipe(gulp.dest('dist'))
		.pipe(notify({
			message: 'Bundle file created',
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
		files: ['dist/imagebuddy.bundle.min.js', 'examples/*'],
		open: false
	});
});

gulp.task('default', ['lint', 'build', 'browser-sync'], function() {
	gulp.watch('source/**/*.js', ['lint', 'build']);
});
