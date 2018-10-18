import { VarsEntity } from './../../entities/vars.entity';
import { createConnection } from "typeorm";
import { configurations } from "@configuration";
const { host, port, databaseName, password, user, connectionName } = configurations.db;
import * as path from "path";

const connection = createConnection({
    name: connectionName,
    type: "mysql",
    host,
    port,
    username: user,
    password,
    database: databaseName,
    insecureAuth: true,
    entities: [VarsEntity]
})


export {
    connection
}