var HtmlWebpackPlugin = require("html-webpack-plugin"),
    webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
       app: './app/app.js',
      vendor: ['angular', 'angular-route']     
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader']
        }, {
            test: /\.html$/,
            use:['html-loader?attrs=false']  
        }]
    },
    devtool: 'source-map',

    plugins: [
        new HtmlWebpackPlugin({
            template: "app/index.ejs"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: Infinity,
        })
	]
}