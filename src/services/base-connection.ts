import { EntityManager, QueryRunner } from 'typeorm';
import { prototype } from 'events';

export abstract class BaseConnection {
    protected queryRunner: QueryRunner = null
    protected entityManager: EntityManager = null;
    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
        this.entityManager = queryRunner.manager;
    }

    protected getPaginationSql(sql: string): string {
        return `with temp_table as (${sql}) 
        select * from temp_table where row between :rowStart and :rowEnd`
    }

    protected getCountSql(sql: string): string {
        return `with temp_table as (${sql}) 
        select count(*) as count from temp_table`
    }

    protected parseSql(sql: string, parameterDic: any): { sql: string, parameters: any[] } {

        const parameters: any[] = [];
        let index = 0;
        const parseSQL = sql.replace(/\:(\w+)/g, (txt, key) => {

            if (parameterDic.hasOwnProperty(key)) {
                const val = parameterDic[key]

                if (Array.isArray(val)) {
                    const arrayConditions: string[] = [];
                    for (const v of val) {
                        parameters.push(v)

                        arrayConditions.push(`@${index++}`);
                    }
                    return arrayConditions.join(' , ')
                } else {
                    parameters.push(val)
                }

                return `@${index++}`
            }

            return txt;
        });

        console.log(`==============parseSQL===============`)
        console.log(parseSQL, parameters)

        return {
            sql: parseSQL,
            parameters
        };
    }
}

