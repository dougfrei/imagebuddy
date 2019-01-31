const path = require('path');

module.exports = {
	mode: 'development',
	cache: true,
	devtool: 'cheap-source-map',
	entry: './source/ImageBuddy.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'imagebuddy.esm.js'
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
	}
};
