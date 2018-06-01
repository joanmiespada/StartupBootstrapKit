const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const optimize = {
  minimizer: [
    new UglifyJSPlugin({
      uglifyOptions: {
        beautify: false,
        compress: true,
        comments: false,
        mangle: false,
        toplevel: false,
        keep_fnames: true,
      },
    }),
  ],
};

module.exports = optimize;

/*

output: {
              comments: false
            },
            compress: {
              unsafe_comps: true,
              properties: true,
              keep_fargs: false,
              pure_getters: true,
              collapse_vars: true,
              unsafe: true,
              warnings: false,
              sequences: true,
              dead_code: true,
              drop_debugger: true,
              comparisons: true,
              conditionals: true,
              evaluate: true,
              booleans: true,
              loops: true,
              unused: true,
              hoist_funs: true,
              if_return: true,
              join_vars: true,
              drop_console: true
            }

*/