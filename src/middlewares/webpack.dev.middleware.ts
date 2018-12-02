import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import * as webpack from "webpack";


const devMiddlewares = [];

if (process.env.BACKEND !== "1") {
    const config = require('../../webpack.config');
    const compiler = webpack(config)

    // Add middleware
    devMiddlewares.push(webpackDevMiddleware(compiler, {
        // publicPath: config.output.publicPath,
        publicPath: '/static/js'

    }))

    // Add hot middleware support
    devMiddlewares.push(webpackHotMiddleware(compiler)) // Check [HMR] connected in console
}




export { devMiddlewares }

