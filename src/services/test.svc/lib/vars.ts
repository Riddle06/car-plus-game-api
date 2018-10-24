import { BaseConnection } from '../../base-connection';
import { BaseResult } from '@view-models/common.vm';
import { VarsEntity } from '@entities/vars.entity';
import { MemberEntity } from '@entities/member.entity';
export class Vars extends BaseConnection {

    async test(): Promise<BaseResult> {
        // await this.queryRunner.manager.getRepository(MemberEntity).find({
        //     relations: ['memberGameItems']
        // })

        await this.entityManager.getRepository(VarsEntity).insert({
            key: `中文測試`,
            description: '中文測試中文測試中文測試中文測試中文測試'
        })




        return new BaseResult(true);
    }

    async testJoin(): Promise<BaseResult> {
        await this.queryRunner.manager.getRepository(MemberEntity).find({
            relations: ['memberGameItems']
        })

        return new BaseResult(true);

    }

    async testJoinConditionAndSelect(): Promise<BaseResult> {
        // await this.queryRunner.manager.getRepository(MemberEntity).find({
        //     join: {
        //         alias: 'member',
        //         leftJoinAndSelect: {
        //             memberGameItems: 'member.memberGameItems'
        //         }
        //     },
        //     where: {
        //         id:"sdfasdfsdaf",

        //     }
        // })

        await this.queryRunner.manager.getRepository(MemberEntity).createQueryBuilder('member')
            .leftJoinAndSelect('member.memberGameItems', 'memberGameItem')
            .where('member.id = :memberId', { memberId: 'member_id_test' })
            .andWhere('memberGameItem.id = :memberGameId', { memberGameId: 'member_game_id_test' }).getMany()


        return new BaseResult(true);

    }

    async testInsert(): Promise<BaseResult> {


        const member = new MemberEntity()
        member.nickName = "測試"

        await this.queryRunner.manager.getRepository(MemberEntity).manager.save(member)


        return new BaseResult(true);

    }
}