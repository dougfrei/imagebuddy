const path = require('path');
const VirtualModulePlugun = require('virtual-module-webpack-plugin');

module.exports = {
	mode: 'production',
	cache: true,
	devtool: 'cheap-source-map',
	entry: './source/virtual-wrapper.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'imagebuddy.min.js'
	},
	resolve: {
		modules: ['node_modules']
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
			moduleName: './source/virtual-wrapper.js',
			contents: 'import ImageBuddy from "./ImageBuddy"; window.ImageBuddy = ImageBuddy;'
		})
	]
};
