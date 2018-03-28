const path = require('path'),
	glob = require('glob'),
	webpack = require('webpack'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	CleanWebpackPlugin = require('clean-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	autoprefixer = require('autoprefixer'),
	autoprefixerOpt = {
		browsers: ['IE 9', 'last 5 versions', 'Firefox 14', 'Opera 11.1', '> 10%']
	};

function getEntry(globPath, entries = {}) {
	let files = glob.sync(globPath),
		basename;

	files.forEach(filepath => {
		basename = path.basename(filepath, path.extname(filepath));
		entries[basename] = filepath;
	});
	return entries;
}

// 自动生 entry
let entry = {vendor: ['./src/libs/jquery/jquery-1.11.2', './src/libs/iscroll/iscroll']};
entry = getEntry('./src/js/*.js', entry);

let plugins = [
	new CleanWebpackPlugin(['dist']),
	new ExtractTextPlugin({
		filename: 'css/[name].css',
		allChunks: true
	}),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		minChunks: Infinity
	}),
	new webpack.optimize.CommonsChunkPlugin({
		name: 'common',
		minChunks: 3,							// 提取公共的最小引入次数 require
		chunks: ['index', 'list', 'pdp']		// 那些入口引入
	}),
	// new webpack.optimize.UglifyJsPlugin(),	// js 压缩
];

// 自动生 htmlPlugins
let htmlEntry = getEntry('./src/pages/*.html');
Object.keys(htmlEntry).forEach(key => {
    let config = {
        filename: key + '.html',					// 输出文件名
        template: htmlEntry[key],					// 编译文件
        minify: { removeAttributeQuotes: true },	// 压缩
        chunks: [key],								// 添加模块
        templateParameters: {title: key}			// 传入模板的参数
    };
    plugins.push(new HtmlWebpackPlugin(config));
});

module.exports = {

	devtool: 'eval-source-map',		// 生产环境去掉

	entry: entry,

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].js'
	},

	resolve: {
		alias: {
			jquery: path.resolve(__dirname, 'src/libs/jquery/jquery-1.11.2'),
			iscroll: path.resolve(__dirname, 'src/libs/iscroll/iscroll')
		}
	},

	devServer: {},

	module: {
		rules: [
			{
				test: /\.js$/,
				use: { loader: 'babel-loader'},			// 将 es6 编译
				exclude: /node_modules/
			},{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [{
							loader: 'css-loader',		// 将 CSS 转化成 CommonJS 模块
							options: { minimize: true}
						},{
							loader: 'postcss-loader',	// 使用 autoprefixerOpt 为 css 自动追加前缀
							options: { plugins: [autoprefixer(autoprefixerOpt)]}
						},{
							loader: 'sass-loader'		// 将 Sass 编译成 CSS
						}]
				})
			},{
				test: /(\.html|\.hbs)$/,
				use: { loader: 'handlebars-loader'}		// 将 html 编译
			},{
				test: /\.(png|svg|jpg|jpeg|gif)$/,
				use: { loader: 'file-loader'}
			},{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: { loader: 'file-loader'}
			}
		]
	},
	plugins: plugins

};