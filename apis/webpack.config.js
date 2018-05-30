'use strict';
var webpack = require('webpack');
var dotenv = require('dotenv-webpack');
var fs = require('fs');
var path = require('path');

var modules = {};

function loadModules(folder)
{
    var nodeModules = {};
    fs.readdirSync(folder) 
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .filter(function(x){
        return ['apis-business-login',
                'apis-business-users',
                'apis-core'
                ].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });
    return nodeModules;
}

modules = loadModules('../../node_modules');

function getCommonConfiguration(filename,pathBase='./build')
{    
    return {
        mode: process.env.NODE_ENV || 'production',
        target: 'node',
        entry: [ 
            '../../certs/apicert.pem',
            './src/index.js'
        ],
        output: {
            path: pathBase, //path.join(__dirname, 'build'),
            filename: filename
        },
        resolve: {
            extensions: ['.js','.json'],
            modules: [
            'node_modules',
            ],
            symlinks: false,
        },
        
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.json$/,
                    use: 'json-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.pem$/,
                    use:[{
                            loader: 'file-loader',
                            options:{
                                name: '[name].[ext]',
                            }
                        }
                    ]   
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            outputPath: 'images/'
                        }
                    }
                    ]
                }
            ],
        },

        externals: modules, 
        plugins: [
            new dotenv({
                path: path.join(__dirname, './.env/env01.env'),  //production environment
                systemvars:true,
                silent:false
            }),  
            new webpack.BannerPlugin({ banner:'require("source-map-support").install();',
                                    raw:true, entryOnly:false}  ),
            new webpack.optimize.SplitChunksPlugin({
                cacheGroups: {
                    commons: {
                        name: "commons",
                        chunks: "initial",
                        minChunks: 2
                    }
                }
            }),
        ],
        devtool:'source-map',
        stats:{
            colors:true
        },
        
    }
}

module.exports=getCommonConfiguration; 