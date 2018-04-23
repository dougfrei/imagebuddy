/* global require, module, __dirname */

const path 				= require('path');
const pkg				= require('./package.json');
const WrapperPlugin		= require('wrapper-webpack-plugin');
const UglifyJsPlugin 	= require('uglifyjs-webpack-plugin');

module.exports = {
	mode: 'production',
	cache: true,
	devtool: 'cheap-source-map',
	entry: './source/imageTools-wrapper.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: `imageTools.bundle.min.js`
	},
	resolve: {
		modules: ['node_modules']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['babel-preset-env', {
								targets: {
									browsers: ['last 2 versions', 'ie >= 11']
								}
							}]
						],
						cacheDirectory: true
					}
				}
			}
		]
	},
	plugins: [
		new UglifyJsPlugin({
			exclude: /(node_modules|bower_components)/,
			cache: true,
			parallel: true,
			uglifyOptions: {
				warnings: true,
				output: {
					comments: false,
					beautify: false
				}
			},
			sourceMap: true
		}),
		new WrapperPlugin({
			header: function () {
				return "/**\n" +
					` * ImageTools v${pkg.version} | ISC` + "\n" +
					" */\n";
			}
		})		
	]
};
