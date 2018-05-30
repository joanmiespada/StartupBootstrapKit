const { resolve } = require('path');
const vendor = require('./vendor');
const rules = require('./rules');
const plugins = require('./plugins');
const devServer = require('./dev_server');
const devtool = require('./devtool');
const optimize = require('./optimize');

const isProduction = process.env.NODE_ENV === 'production';

const settings = {
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css', '.scss'],
    modules: [
      'node_modules',
    ],
    symlinks: false,
  },
  context: resolve(__dirname, '..'),
  entry: {
    app: [
      //'react-hot-loader/patch',
      // 'babel-polyfill',
      './src/index.jsx',
    ],
    vendor,
    depens: ['backoffice-users']
  },
  output: {
    filename: '[name].[hash].js',
    path: resolve(__dirname, '..', 'dist'),
    chunkFilename: '[name].[hash].js',
  },
  module: {
    rules,
  },
  plugins,
  devServer,
  devtool,
  optimization: isProduction ? optimize : {},
};
module.exports = settings;
