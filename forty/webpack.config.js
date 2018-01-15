// because the bundle includes library of classes, use "library"
// because we are using ES6 syntax (class), need also to include babel
//  (to transpile to ES5 as understood by webpack)
var path = require('path');
var libraryName = 'BJSS';
module.exports = {
    entry: {
        filename: './assets/js/bjss.js'
    },
    output: {
        filename: './assets/js/bjss_model.js',
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            { test: path.join(__dirname, 'es6'),
              loader: 'babel-loader' }
        ]
    }
};