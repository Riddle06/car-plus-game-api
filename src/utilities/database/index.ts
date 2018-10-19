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

    private isInitial: boolean = false

    private async init(): Promise<this> {

        if (this.isInitial) {
            return this;
        }

        const { host, port, databaseName, password, user, connectionName } = configurations.db;

        this.connection = await createConnection({
            name: connectionName,
            type: "mysql",
            host,
            port,
            username: user,
            password,
            database: databaseName,
            insecureAuth: true,
            entities: [`${path.resolve(__dirname, '../../entities')}/*.js`]
        });

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

}

export const dbProvider = DatabaseProvider.getInstance();