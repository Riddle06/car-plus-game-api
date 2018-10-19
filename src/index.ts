import "module-alias/register";
import * as express from "express";
import { configurations } from "@configuration";
import routers from "./routers";
import { memberTokenVerificationMiddleware } from "./middlewares";

const app = express();

app.use(memberTokenVerificationMiddleware);
app.use(routers);
app.listen(configurations.app.port, async () => {
    console.log(`Car Plus Game API  is Starting on port ${configurations.app.port} , environment is ${configurations.app.env}`);
});

process.on('unhandledRejection', console.dir);