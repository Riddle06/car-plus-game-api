import * as dotenv from "dotenv";

interface ApplicationConfig {
    port: number
    env: "dev" | "sit" | "production"
}

interface DatabaseConfig {
    host: string
    port: number
    user: string
    password: string
    databaseName: string
}

interface Configurations {
    app: ApplicationConfig
    db: DatabaseConfig
}

function getNodeEnv(env: string): "dev" | "sit" | "production" {

    if (!env) {
        return "dev";
    }

    if ("dev" === env.toLowerCase()) {
        return "dev";
    }

    if ("sit" === env.toLowerCase()) {
        return "sit";
    }

    if ("production" === env.toLowerCase()) {
        return "production";
    }

    return "dev";
}


export const configurations: Configurations = {
    app: {
        port: process.env.PORT ? +process.env.PORT : 8080,
        env: getNodeEnv(process.env.NODE_ENV)
    },
    db: {
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        databaseName: process.env.DB_DATABASE_NAME,
    }

}