var path = require('path');

module.exports = {
    mode: "production",
    entry: {
        "catch.game": './src-client/scenes/catch.game.scene.ts'
    },
    output: {
        path: path.resolve(__dirname, 'client-dist/js'),
        filename: '[name].bundle.js',
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
            "@view-models": path.resolve(__dirname, 'src/view-models/')
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
