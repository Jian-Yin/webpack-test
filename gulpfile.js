const gulp = require('gulp'),
	webpack = require('webpack'),
	webpackDevServer = require('webpack-dev-server'),
	webpackConfig = require('./webpack.config.js'),
	myConfig = Object.create(webpackConfig);

gulp.task('server', function() {

	new webpackDevServer(webpack(myConfig), {
		contentBase: './dist',
		hot: true,
		compress: true,
		stats: { colors: true },
		disableHostCheck: true

	}).listen(8080);

});