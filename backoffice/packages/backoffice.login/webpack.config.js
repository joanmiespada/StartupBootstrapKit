'use strict';
var path = require('path');
var common = require('../../webpack.libs.config')

const config = common('backoffice.login.js', path.join(__dirname, 'dist')); 

module.exports = config;