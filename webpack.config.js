var path = require('path');
var webpack = require('webpack');
// var env =  "production" 
//var env =  "development" 
var HtmlWebpackPlugin = require('html-webpack-plugin');
//const UglifyESPlugin = require('uglify-es-webpack-plugin');

module.exports = function(env) {
  var dir = env.dir
  if(!env.dir){
    throw new Error('USAGE: webpack --env.dir=directory');
  }
  var output = env.output
  var entry = env.entry
  if(!entry)
    entry = dir + ".js"
  if(!output)
    output = dir + ".build.js"

  const jsSourcePath = path.join(__dirname, dir)
  const buildPath = path.resolve('../webapp/resources', dir);
  var config = {
    context: jsSourcePath,
    entry: {
      app: entry, //entry point for building scripts
      vendor: [
         '../common/common', '../common/vendor'
       ]
    },
    output: {
      path: buildPath,
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
      modules: [
        jsSourcePath, 'node_modules'
      ],
    },
    resolveLoader: {
      modules: ['node_modules']
    },
    module: {
      rules: [
        { //transpile ES2015 with JSX into ES5
          test: /\.js$/,
//          exclude:  /node_modules(\/!(leay-year)\/).*/,
          exclude:  /node_modules/,
//          include: [
//              path.resolve(__dirname, "node_modules/leap-year")
//          ],
          use:[
            {
              loader: 'babel-loader',
              options: {
                presets: ['react',  "es2015"],
//                ignore: '/node_modules/'
              }
            }]
        }
      ]
    },
    devtool: 'inline-source-map',
    plugins: [new HtmlWebpackPlugin({template:'../index.template.ejs'}),
              new webpack.DefinePlugin({'BASE_URL': JSON.stringify("/react-sample")}),
              new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
//        new UglifyESPlugin({})
    ],
    devServer: {
      port: 9000,
      proxy: {
        "/react-sample": "http://localhost:8080",
      },
      historyApiFallback: {
        index: 'index.html'
      },
      publicPath:"/react-sample-dev/pages/" + dir
    }
  }
  return config

}