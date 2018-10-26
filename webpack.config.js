var path = require('path');

module.exports = {
    mode: "production",
    entry: './src-client/index.ts',
    output: {
        path: path.resolve(__dirname, 'client-dist/js'),
        filename: '[name].bundle.js',
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    }
};
