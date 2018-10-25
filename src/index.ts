import "module-alias/register";
import * as express from "express";
import { configurations } from "@configuration";
import routers from "./routers";
import { memberTokenVerificationMiddleware, responseEndMiddleware } from "./middlewares";
import { testSvc } from "@services/test.svc";
import * as bodyParser from "body-parser";
import * as path from "path";

const app = express();

app.use('/', express.static(path.resolve(__dirname, '../client-dist')))
app.use('/api', [bodyParser.json(), memberTokenVerificationMiddleware, routers, responseEndMiddleware])

app.listen(configurations.app.port, async () => {
    console.log(`Car Plus Game API  is Starting on port ${configurations.app.port} , environment is ${configurations.app.env}`);
});

process.on('unhandledRejection', console.dir);