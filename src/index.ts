import "module-alias/register";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import { configurations } from "@configuration";
import routers from "./routers";
import pageRouter from "./page.routers";
import { memberTokenVerificationMiddleware, responseEndMiddleware, clientMiddleware, devMiddlewares  } from "./middlewares";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as hbs from "hbs";


const app = express();

if (configurations.app.env === 'dev') {
    console.log(`webpack develop mode on`)
    app.use(devMiddlewares);
}


app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, '../views'));
app.engine('hbs', hbs.__express);
hbs.registerPartials(path.resolve(__dirname, '../views/partials'));
app.use('/static', express.static(path.resolve(__dirname, '../client-dist')));

app.use('/', [cookieParser(), clientMiddleware, pageRouter]);



app.use('/api', [bodyParser.json(),
    memberTokenVerificationMiddleware,
    routers,
    responseEndMiddleware])

app.listen(configurations.app.port, async () => {
    console.log(`Car Plus Game API  is Starting on port ${configurations.app.port} , environment is ${configurations.app.env}`);
});

process.on('unhandledRejection', console.dir);