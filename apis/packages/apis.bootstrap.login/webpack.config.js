'use strict';
var path = require('path');
var common = require('../../webpack.config')

const config = common('api.login.js', path.join(__dirname, 'build')); 

module.exports = config;