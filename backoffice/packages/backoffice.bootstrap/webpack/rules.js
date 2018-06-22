const { join } = require('path');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === 'production';

const rules = [
  {
    enforce: "pre",
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: "eslint-loader",
  },
  {
    test: /\.(js|jsx|mjs)$/,
    exclude: /node_modules/,
    use:[
      {
        loader: 'babel-loader'
      }
    ]
  }, {
    test: /\.s?[ac]ss$/,
    use: [ 
      isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader',
      { 
        loader: 'postcss-loader',
        options: {
          config: {
            path: './postcss.config.js'
          }
        }
      },
      'sass-loader'
    ]
  }, {
    test: /\.(woff2|woff|ttf|eot|svg)(\?.*$|$)/,
    loader: 'file-loader?name=fonts/[name].[ext]'
    
  }, {
    test: /\.(jpg|jpeg|gif|png|ico)(\?.*$|$)$/,
    loader: 'file-loader?name=img/[name].[ext]'
    
}];
module.exports = rules;
