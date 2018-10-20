import { EntityManager, QueryRunner } from 'typeorm';
import { prototype } from 'events';

export abstract class BaseConnection {
    protected queryRunner: QueryRunner = null
    protected entityManager: EntityManager = null;
    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
        this.entityManager = queryRunner.manager;
    }
}

