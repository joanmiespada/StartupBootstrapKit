const { join } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rules = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use:[
      {
        loader: 'babel-loader'
      }
    ]
  }, {
    test: /\.scss$/,
    exclude: /node_modules/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [{
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 2,
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      }, {
        loader: 'postcss-loader',
        options: {
          config: {
            path: './postcss.config.js'
          }
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
        },
      }],
    }),
  }, {
    test: /\.css$/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 2,
        modules: true,
        localIdentName: '[name]__[local]___[hash:base64:5]',
      },
    }, {
      loader: 'postcss-loader',
      options: {
        config: {
          path: './postcss.config.js'
        }
      }
    }],
  }, {
    test: /\.(woff2|woff|ttf|eot|svg)(\?.*$|$)/,
    loader: 'file-loader?name=fonts/[name].[ext]',
    include: [
      join(__dirname, 'src'),
      join(__dirname, 'node_modules'),
    ],
  }, {
    test: /\.(jpg|jpeg|gif|png|ico)(\?.*$|$)$/,
    loader: 'file-loader?name=img/[name].[ext]',
    include: [
      join(__dirname, 'src'),
      join(__dirname, 'node_modules'),
    ],
}];
module.exports = rules;
