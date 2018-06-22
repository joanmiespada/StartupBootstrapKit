const isProduction = process.env.NODE_ENV === 'production';

const devtool = 'source-map'; // isProduction ? 'source-map' : 'inline-cheap-module-source-map';

module.exports = devtool;
