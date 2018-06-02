const { resolve, join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const {GenerateSW} = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProduction = process.env.NODE_ENV === 'production';

const dist = 'dist';
// the path(s) that should be cleaned
const pathsToClean = [
  `${dist}/*.*`,
];
// the clean options to use
const cleanOptions = {
  root: resolve(__dirname, '..'),
  exclude: [`${dist}/.gitignore`],
  verbose: true,
  dry: false,
};
const plugins = [
  new DuplicatePackageCheckerPlugin(),
  //new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
  new webpack.EnvironmentPlugin({ NODE_ENV: process.env.NODE_ENV }),
  new CleanWebpackPlugin(pathsToClean, cleanOptions),
  new LodashModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: join('public', 'index.html'),
  }),
  new CopyWebpackPlugin( [{ from: './public', to: './'}] , { ignore: ['*.html'] } ), 
  new MiniCssExtractPlugin({
    filename: isProduction ? '[name].css'  : '[name].[hash].css',
    path: resolve(__dirname, '..', 'dist'),
    chunkFilename:  isProduction ? '[id].css' : '[id].[hash].css',
    
    allChunks: true,
  }),
  new webpack.optimize.SplitChunksPlugin({
    name: 'vendor',
    minChunks: Infinity,
  }),
  new webpack.NamedModulesPlugin(),
];

if (isProduction) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CopyWebpackPlugin([{
      from: require.resolve('workbox-sw'),
      to: 'workbox-sw.prod.js',
    }]),
    new GenerateSW({
      globDirectory: dist,
      globPatterns: ['**/*.{html,js,css}'],
      //swSrc: join('src', 'service-worker.js'),
      swDest: join(dist, 'service-worker.js'),
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: '/index.html',
    })
  );
} else {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    //new BundleAnalyzerPlugin()
    );

}
module.exports = plugins;
