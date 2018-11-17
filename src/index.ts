import "module-alias/register";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import { configurations } from "@configuration";
import routers from "./routers";
import pageRouter from "./page.routers";
import { memberTokenVerificationMiddleware, responseEndMiddleware, clientMiddleware, devMiddlewares  } from "./middlewares";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as expressHandlebars from "express-handlebars";


const app = express();

if (configurations.app.env === 'dev') {
    app.use(devMiddlewares);
}


const hbsExtname = '.hbs';
const hbs = expressHandlebars.create({
  extname: hbsExtname,
  defaultLayout: 'index',
  helpers: {
    section(name, block) {
      if(!this._sections) this._sections = {};
      this._sections[name] = block.fn(this);
      return null;
    },
  },
});
app.engine(hbsExtname, hbs.engine);
app.set('view engine', hbsExtname);


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