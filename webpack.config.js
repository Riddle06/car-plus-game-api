var path = require('path');
var webpack = require('webpack');

module.exports = {
    mode: "production",
    entry: {
        vendor: ['jquery'],
        "catch.game": './src-client/entry/catch.game.ts',
        "shot.game": './src-client/entry/shot.game.ts',
        "profile": "./src-client/entry/profile.ts",
        "home": "./src-client/entry/home.ts",
        "game.intro": "./src-client/entry/game.intro.ts",
        "game.result": "./src-client/entry/game.result.ts",
        "question": "./src-client/entry/question.ts",
        "admin.login": "./src-client//entry-admin/login.ts",
    },
    output: {
        path: path.resolve(__dirname, 'client-dist/js'),
        filename: '[name].bundle.js',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    name: "vendor",
                }
            }
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
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                  },
                  {
                    loader: "css-loader" // translates CSS into CommonJS
                  },
                  {
                    loader: "sass-loader" // compiles Sass to CSS
                  }]
            }
        ]
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery"
        // })
    ]
};
