import * as dotenv from "dotenv";
dotenv.config();

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
    connectionName: string
}

interface TokenConfig {
    securityKey: string
}

interface Configurations {
    app: ApplicationConfig
    db: DatabaseConfig
    token: TokenConfig
    dbCarPlus: DatabaseConfig
    officialHost: string
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
        port: process.env.APP_PORT ? +process.env.APP_PORT : 8080,
        env: getNodeEnv(process.env.NODE_ENV)
    },
    db: {
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        databaseName: process.env.DB_DATABASE_NAME,
        connectionName: 'carPlusGame'
    },
    token: {
        securityKey: process.env.DB_DATABASE_NAME
    },
    dbCarPlus: {
        host: process.env.DB_CAR_PLUS_HOST,
        port: +process.env.DB_CAR_PLUS_PORT,
        user: process.env.DB_CAR_PLUS_USER,
        password: process.env.DB_CAR_PLUS_PASSWORD,
        databaseName: process.env.DB_CAR_PLUS_DATABASE_NAME,
        connectionName: 'carPlusSystem'
    },
    officialHost: process.env.OFFICIAL_HOST || "https://www.car-plus.com.tw"
}