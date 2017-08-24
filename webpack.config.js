var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


var proxy = '';
var folderArr = path.resolve(__dirname).split(path.sep);
var projectDir = folderArr[folderArr.length-1];

//check if this config is running through webpack dev server or not
const isDevServer = process.argv[1].indexOf('webpack-dev-server') !== -1;
if (isDevServer) {
  try {
    //check proxy.json is in the root folder
    fs.accessSync('./proxy.json', fs.F_OK);
    var proxy = require('./proxy.json').local;
    var thePort = require('./proxy.json').port;

  } catch (e) {
    //proxy json hasn't been set up for local dev. Prompt the user and kill the process.
    console.error('\n\n=========================\n\n⛔️   proxy.json is missing!\n- Make a copy of proxy.sample.json,\n- set your local dev path\n- rename it proxy.json\n\n=========================\n\n');
    process.exit(1);

  }
}

module.exports = {
  entry: './hmppsAssets/js/src/main.js',
  devtool: 'source-map',
  output: {
    filename: 'js/application.js',
    path: __dirname+ '/hmppsAssets',
    publicPath: '/hmppsAssets'
  },
  module: {
		rules: [
			{
        test: /\.js/,
        use: ['babel-loader'],
        include: path.resolve(__dirname, 'hmppsAssets')
      },
    ],
  },
  devServer: {
    inline: true,
    port: thePort,
    proxy: {
      '*': proxy
    }
  },
  resolve: {
    alias: {
      hmppsAssets: path.join(__dirname, 'hmppsAssets')
    }
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new ExtractTextPlugin({
      filename: "css/rc.css"
    }),
  ]
}

if (isDevServer) {
  module.exports.plugins.push(new BundleAnalyzerPlugin());
}
