'use strict';
var fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';

function loadModules(folder)
{
    var nodeModules = {};
    fs.readdirSync(folder) 
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    /*.filter(function(x){
        return ['backoffice-xxxxx'
                ].indexOf(x) === -1;
    })*/
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });
    return nodeModules;
}

var modules = loadModules('../../node_modules');

//console.log(modules)

function getCommonConfiguration(filename,pathBase='./dist')
{ 
    
    const config = {
        mode: process.env.NODE_ENV || 'development',
        entry: './index.js',
        resolve: {
            extensions: ['.js','.jsx','.json'],
            //modules: [
            //    'node_modules',
            //],
            //symlinks: false,
        },
        output: {
            path: pathBase,
            filename: filename,
            libraryTarget: 'umd',
        },
        externals: modules,
        module: {
            rules: [
                {
                    enforce: "pre",
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: "eslint-loader",
                },
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader:'babel-loader'
                    }
                }
            ]
        },
        devtool:'source-map', //isProduction ? 'source-map': 'cheap-module-eval-source-map',
        stats: {
            colors:true
        },
       
    }
    return config; 
    
}

module.exports = getCommonConfiguration;
