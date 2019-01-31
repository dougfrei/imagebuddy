const { series, parallel, src, dest, watch } = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');
const header = require('gulp-header');
const webpack = require('webpack');
const webpackStream	= require('webpack-stream');
const webpackConfigModule = require('./webpack/module.config.js');
const webpackConfigDist	= require('./webpack/dist.config.js');
const pkg = require('./package.json');

const banner = [
	'/**',
	' * <%= pkg.name %>',
	' *',
	' * @version v<%= pkg.version %>',
	' * @link <%= pkg.homepage %>',
	' * @license <%= pkg.license %>',
	' */',
	''
].join('\n');

function lint() {
	return src('source/ImageBuddy.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
}

function buildModule() {
	return src('source/ImageBuddy.js')
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(webpackStream(webpackConfigModule, webpack))
		.pipe(dest('dist'))
		.pipe(notify({
			message: 'Module file created',
			onLast: true
		}));
}

function buildDistributable() {
	return src('source/ImageBuddy.js')
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(webpackStream(webpackConfigDist, webpack))
		.pipe(header(banner, { pkg }))
		.pipe(dest('dist'))
		.pipe(notify({
			message: 'Bundle file created',
			onLast: true
		}));
}

function startBrowserSync(cb) {
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

	cb();
}

function watchJS(cb) {
	watch('source/**/*.js', series(lint, buildDistributable));
	cb();
}

exports.lint = lint;
exports.build_dist = buildDistributable;
exports.build_module = buildModule;
exports.build = parallel(buildDistributable, buildModule);
exports.browsersync = startBrowserSync;

exports.default = series(lint, parallel(buildDistributable, buildModule), startBrowserSync, watchJS);
