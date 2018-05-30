const path = require('path');

const settings= 
    {
        mode: 'production',
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'backoffice-users.js',
            libraryTarget: 'umd',
            globalObject: 'this',
            // libraryExport: 'default',
            library: 'webpackUsers'
        },
        externals:[ 
            {
            'lodash': {
                    commonjs: 'lodash',
                    commonjs2: 'lodash',
                    amd: 'lodash',
                    root: '_'
                },
            },
            'react'
        ],
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
    };
module.exports = settings;
