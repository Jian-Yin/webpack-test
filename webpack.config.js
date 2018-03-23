const HtmlWebpackPlugin = require('html-webpack-plugin'),
	autoprefixer = require('autoprefixer'),
	autoprefixerOpt = {
		browsers: ['IE 9', 'last 5 versions', 'Firefox 14', 'Opera 11.1', '> 10%']
	};

module.exports = {

	// mode: 'development' /*production*/,

	entry: {
		index: './src/js/index.js',
		list: './src/js/list.js'
	},

	output: {
		path: __dirname + '/dist',
		filename: 'js/[name].js'
	},

	devServer: {},

	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader'			// 将 es6 编译
				},
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: [{
						loader: 'style-loader'		// 将 JS 字符串生成为 style 节点
					},{
						loader: 'css-loader'		// 将 CSS 转化成 CommonJS 模块
					},{
						loader: 'postcss-loader',	// 使用 autoprefixerOpt 为 css 自动追加前缀
						options: { plugins: [autoprefixer(autoprefixerOpt)]}
					},{
						loader: 'sass-loader'		// 将 Sass 编译成 CSS
					}
				]
			},{
				test: /(\.html|\.hbs)$/,
				use: {
					loader: 'handlebars-loader'		// 将 html 编译
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',					// 输出文件名
			template: './src/html/index.html',		// 编译文件
			chunks: ['index'],						// 添加模块
			templateParameters: {title: '111111'}	// 传入模板的参数
		}),
		new HtmlWebpackPlugin({
			filename: 'list.html',
			template: './src/html/list.html',
			chunks: ['list']
		})
	]

};