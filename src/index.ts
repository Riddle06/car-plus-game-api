import "module-alias/register";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import { configurations } from "@configuration";
import routers from "./routers";
import pageRouter from "./page.routers";
import { memberTokenVerificationMiddleware, responseEndMiddleware, clientMiddleware, devMiddlewares, adminTokenVerificationMiddleware, listQueryHandlerMiddleware } from "./middlewares";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as hbs from "hbs";
import * as cors from "cors";
import AdminRouter from './routers/admin.router';


const app = express();

app.use(cors());

if (configurations.app.env === 'dev') {
    console.log(`webpack develop mode on`)
    app.use(devMiddlewares);
}


app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, '../views'));
app.engine('hbs', hbs.__express);
hbs.registerPartials(path.resolve(__dirname, '../views/partials'));
app.use('/static', express.static(path.resolve(__dirname, '../client-dist')));

// client side 的 middleware & page routers
app.use('/', [cookieParser(), clientMiddleware, pageRouter]);

// api
app.use('/api', [
    bodyParser.json(),
    listQueryHandlerMiddleware,
    memberTokenVerificationMiddleware,
    routers,
    responseEndMiddleware])

// admin api
app.use('/admin/api', [
    bodyParser.json(),
    listQueryHandlerMiddleware,
    adminTokenVerificationMiddleware,
    AdminRouter,
    responseEndMiddleware])

app.listen(configurations.app.port, async () => {
    console.log(`Car Plus Game API  is Starting on port ${configurations.app.port} , environment is ${configurations.app.env}`);
});

process.on('unhandledRejection', console.dir);