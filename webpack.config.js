var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// set up extraction of individual css files
const cssHmppsMain = new ExtractTextPlugin('css/hmpps.css');
const cssHmppsIE8 = new ExtractTextPlugin('css/hmpps-ie8.css');
const cssHmppsIE7 = new ExtractTextPlugin('css/hmpps-ie7.css');
const cssHmppsIE6 = new ExtractTextPlugin('css/hmpps-ie6.css');

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
      {
        test: /\hmpps.scss$/,
        use: cssHmppsMain.extract({
            fallback: "style-loader",
            use: [
                {loader: "css-loader", options: { sourceMap: isDevServer }},
                {loader: "sass-loader", options: { sourceMap: isDevServer }}
            ],
            publicPath: "/hmppsAssets"
        })
      },
      {
        test: /\hmpps-ie8.scss$/,
        use: cssHmppsIE8.extract({
            fallback: "style-loader",
            use: [
                {loader: "css-loader", options: { sourceMap: isDevServer }},
                {loader: "sass-loader", options: { sourceMap: isDevServer }}
            ],
            publicPath: "/hmppsAssets"
        })
      },
      {
        test: /\hmpps-ie7.scss$/,
        use: cssHmppsIE7.extract({
            fallback: "style-loader",
            use: [
                {loader: "css-loader", options: { sourceMap: isDevServer }},
                {loader: "sass-loader", options: { sourceMap: isDevServer }}
            ],
            publicPath: "/hmppsAssets"
        })
      },
      {
        test: /\hmpps-ie6.scss$/,
        use: cssHmppsIE6.extract({
            fallback: "style-loader",
            use: [
                {loader: "css-loader", options: { sourceMap: isDevServer }},
                {loader: "sass-loader", options: { sourceMap: isDevServer }}
            ],
            publicPath: "/hmppsAssets"
        })
      },
    ],
  },
  devServer: {
    inline: true,
    port: thePort,
    proxy: {
      '**': proxy
    }
  },
  resolve: {
    alias: {
      hmppsAssets: path.join(__dirname, 'hmppsAssets')
    }
  },
  plugins: [
    cssHmppsMain,
    cssHmppsIE8,
    cssHmppsIE7,
    cssHmppsIE6
  ]
}

if (isDevServer) {
  // do dev only stuff here
  module.exports.devtool = 'source-map';
  module.exports.plugins.push(new BundleAnalyzerPlugin());
} else {
  // do production only stuff here
  module.exports.plugins.push(new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }));
}
