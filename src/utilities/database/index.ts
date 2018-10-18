import { createConnection } from "typeorm";
import { configurations } from "@configuration";
const { host, port, databaseName, password, user } = configurations.db

const connection = createConnection({
    name: "carPlusGame",
    type: "mysql",
    host,
    port,
    username: user,
    password,
    database: databaseName,
    insecureAuth: true
})


export {
    connection
}