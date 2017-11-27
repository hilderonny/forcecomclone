module.exports = {
    devtool: 'inline-source-map',
    entry: './src/client/index.ts',
    output: { filename: 'dist/client/index.js' },
    module: {
        rules: [ { test: /\.tsx?$/, loader: 'ts-loader' } ]
    },
    resolve: { extensions: [ '.ts', '.tsx', '.js' ] }
}