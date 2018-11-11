var path = require('path');
var webpack = require('webpack');

module.exports = {
    mode: "production",
    entry: {
        "catch.game": './src-client/entry/catch.game.ts',
        "shot.game": './src-client/entry/shot.game.ts',
        "profile": "./src-client/entry/profile.ts",
        "home": "./src-client/entry/home.ts",
        "game.intro": "./src-client/entry/game.intro.ts",
        "game.result": "./src-client/entry/game.result.ts",
        "question": "./src-client/entry/question.ts"
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
            }]
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery"
        // })
    ]
};
