var webpack = require('webpack');

module.exports = {
    entry: './src/client/index.ts',
    output: { filename: 'dist/client/index.js' },
    module: {
        rules: [ { test: /\.tsx?$/, loader: 'ts-loader' } ]
    },
    resolve: { extensions: [ '.ts', '.tsx', '.js' ] }
}