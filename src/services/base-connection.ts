import { EntityManager, QueryRunner } from 'typeorm';

export abstract class BaseConnection {
    protected queryRunner: QueryRunner = null
    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }
}

