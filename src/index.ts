import "module-alias/register";
import * as express from "express";
import { configurations } from "@configuration";
import routers from "./routers";
import { memberTokenVerificationMiddleware, responseEndMiddleware } from "./middlewares";
import { testSvc } from "@services/test.svc";
import * as bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json(), memberTokenVerificationMiddleware);
app.use(routers);
app.use(responseEndMiddleware)
app.listen(configurations.app.port, async () => {
    console.log(`Car Plus Game API  is Starting on port ${configurations.app.port} , environment is ${configurations.app.env}`);
    await testSvc.test()
});

process.on('unhandledRejection', console.dir);