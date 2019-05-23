const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const VirtualModulePlugun = require('virtual-module-webpack-plugin');

const packageJSON = JSON.parse(fs.readFileSync('./package.json'));
const bannerContents = [
	'/**',
	` * ${packageJSON.name}`,
	' *',
	` * @version v${packageJSON.version}`,
	` * @link ${packageJSON.homepage}`,
	` * @license ${packageJSON.license}`,
	' *',
	' */',
	''
].join('\n');

module.exports = {
	mode: 'production',
	cache: true,
	devtool: 'cheap-source-map',
	entry: './dist/virtual-wrapper.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'imagebuddy.browser.min.js'
	},
	resolve: {
		modules: ['node_modules'],
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true
					}
				}
			}
		]
	},
	plugins: [
		new VirtualModulePlugun({
			moduleName: './dist/virtual-wrapper.js',
			contents: 'import ImageBuddy from "./ImageBuddy"; window.ImageBuddy = ImageBuddy;'
		}),
		new webpack.BannerPlugin({
			banner: bannerContents,
			raw: true
		})
	]
};
