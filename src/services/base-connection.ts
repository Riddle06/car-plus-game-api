import { EntityManager } from "typeorm";

export abstract class BaseConnection {
    protected entityManager: EntityManager = null
    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
    }
}

