var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
console.log(debug? "development":"production");



module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "eval" : 'cheap-module-source-map',
  entry: "./js/client.js",

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
        }
      },
      {
        test: /\.css$/,
        loaders: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  
  progress: true,
  
  output: {
    path: __dirname + "/src/",
    filename: debug ? "client.deb.js" : "client.min.js"
  },
  
  plugins: debug ? [] : [

    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      /*
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      */
      comments: false
    }),
    //new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
};



