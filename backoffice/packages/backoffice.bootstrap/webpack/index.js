const { resolve } = require('path');
const vendor = require('./vendor');
const rules = require('./rules');
const plugins = require('./plugins');
const devServer = require('./dev_server');
const devtool = require('./devtool');
const optimize = require('./optimize');

const isProduction = process.env.NODE_ENV === 'production';

const settings = {
  mode: process.env.NODE_ENV || 'development',
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css', '.scss'],
    /*alias:
    {
      'react-lifecycles-compat': resolve(__dirname, '../../../node_modules/react-lifecycles-compat')
    },*/
    modules: [
      'node_modules',
      './src'
    ],
    symlinks: false,
  },
  context: resolve(__dirname, '..'),
  entry: //'./src/index.js',
  {
    app: [
      './src/index.js',
    ],
    vendor,
    depens: ['backoffice-users', 'backoffice-login' ]
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
