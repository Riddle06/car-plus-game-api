import "module-alias/register";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import { configurations } from "@configuration";
import routers from "./routers";
import pageRouter from "./page.routers";
import { memberTokenVerificationMiddleware, responseEndMiddleware, clientMiddleware, devMiddlewares, adminTokenVerificationMiddleware, listQueryHandlerMiddleware } from "./middlewares";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as expressHandlebars from "express-handlebars";
import * as cors from "cors";
import AdminRouter from './routers/admin.router';
import { memberSvc } from "@services";
import { eventTrigger } from "@services/event.trigger.svc";

const app = express();

app.use(cors());

if (configurations.app.env === 'dev' && process.env.BACKEND !== "1") {
    app.use(devMiddlewares);
}

const hbsExtname = '.hbs';
const hbs = expressHandlebars.create({
    extname: hbsExtname,
    defaultLayout: 'index',
    helpers: {
        section(name, block) {
            if (!this._sections) this._sections = {};
            this._sections[name] = block.fn(this);
            return null;
        },
    },
});
app.engine(hbsExtname, hbs.engine);
app.set('view engine', hbsExtname);


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

    // fix empty shortId
    await memberSvc.handleEmptyShortIdMembers();
});

process.on('unhandledRejection', console.dir);