import { VarsEntity } from './../../entities/vars.entity';
import { createConnection, QueryRunner, Connection, getConnection } from "typeorm";
import { configurations } from "@configuration";
import * as path from "path";

class DatabaseProvider {

    private static instance: DatabaseProvider = null;

    static getInstance(): DatabaseProvider {
        if (DatabaseProvider.instance === null) {
            DatabaseProvider.instance = new DatabaseProvider();
        }
        return DatabaseProvider.instance;
    }
    private constructor() { }

    private connection: Connection = null;

    private carPlusConnection: Connection = null

    private isInitial: boolean = false

    private async init(): Promise<this> {

        if (this.isInitial) {
            return this;
        }

        const { host, port, databaseName, password, user, connectionName } = configurations.db;

        // 遊戲資料庫連線設定
        this.connection = await createConnection({
            name: connectionName,
            type: "mssql",
            host,
            port,
            username: user,
            password,
            database: databaseName,
            logger: 'advanced-console',
            logging: 'all',
            schema: 'dbo',
            options: {},
            entities: [`${path.resolve(__dirname, '../../entities')}/*.js`]
        });

        // 格上會員系統資料庫連線設定
        await this.setCarPlusConnection();

        this.isInitial = true;

        return this;
    }


    async createQueryRunner(): Promise<QueryRunner> {

        if (!this.isInitial) {
            await this.init();
        }

        return this.connection.createQueryRunner();
    }

    async createTransactionQueryRunner(): Promise<QueryRunner> {

        if (!this.isInitial) {
            await this.init();
        }
        const queryRunner = await this.createQueryRunner();

        await queryRunner.startTransaction()

        return queryRunner;
    }


    async createCarPlusQueryRunner(): Promise<QueryRunner> {
        if (!this.isInitial) {
            await this.init();
        }

        return this.carPlusConnection.createQueryRunner();
    }

    async createCarPlusTransactionQueryRunner(): Promise<QueryRunner> {
        if (!this.isInitial) {
            await this.init();
        }
        const queryRunner = await this.createCarPlusQueryRunner();

        await queryRunner.startTransaction()

        return queryRunner;
    }

    private async setCarPlusConnection(): Promise<void> {

        const { host, port, databaseName, password, user, connectionName } = configurations.dbCarPlus;
        this.carPlusConnection = await createConnection({
            name: connectionName,
            type: "mssql",
            host,
            port,
            username: user,
            password,
            database: databaseName,
            logger: 'advanced-console',
            logging: 'all',
            schema: 'dbo',
            options: {},
            entities: []
        });
    }


}

export const dbProvider = DatabaseProvider.getInstance();