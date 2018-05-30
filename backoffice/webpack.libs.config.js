'use strict';
var fs = require('fs');

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

function getCommonConfiguration(filename,pathBase='./dist')
{ 
    
    const config = {
        mode: process.env.NODE_ENV || 'development',
        entry: './index.js',
        resolve: {
            extensions: ['.js','.jsx','.json'],
            modules: [
                'node_modules',
            ],
            symlinks: false,
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
                    test: /\.jsx?$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader:'babel-loader'
                    }
                }
            ]
        },
        devtool: 'source-map',
        stats: {
            colors:true
        }
    }
    return config; 
    
}

module.exports = getCommonConfiguration;
