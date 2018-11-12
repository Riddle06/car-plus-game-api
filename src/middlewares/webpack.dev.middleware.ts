import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import * as webpack from "webpack";
const config = require('../../webpack.config');
const compiler = webpack(config)

const devMiddlewares = [];

// Add middleware
devMiddlewares.push(webpackDevMiddleware(compiler, {
    // publicPath: config.output.publicPath,
    publicPath: '/static/js'

}))

// Add hot middleware support
devMiddlewares.push(webpackHotMiddleware(compiler)) // Check [HMR] connected in console


export { devMiddlewares }

