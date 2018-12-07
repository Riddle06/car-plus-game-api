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
        "question": "./src-client/entry/question.ts",
        "shop": "./src-client/entry/shop.ts",
        "shop.merch": "./src-client/entry/shop.merch.ts",
        "game.item": "./src-client/entry/game.item.ts",
        "admin.login": "./src-client/entry-admin/login.ts",
        "admin.index": "./src-client/entry-admin/index.ts",
        "admin.members": "./src-client/entry-admin/members.ts",
        "admin.game-history": "./src-client/entry-admin/game-history.ts",
        "admin.point-history": "./src-client/entry-admin/point-history.ts",
        "admin.supplement": "./src-client/entry-admin/supplement.ts",
        "admin.report": "./src-client/entry-admin/report.ts",
        "admin.blacklist": "./src-client/entry-admin/blacklist.ts",
    },
    output: {
        path: path.resolve(__dirname, 'client-dist/js'),
        filename: '[name].bundle.js',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
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
