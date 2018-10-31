import { BaseConnection } from '@services/base-connection';
import { QueryRunner, Repository, Raw } from 'typeorm';
import { PointHistoryVM, PointHistoryType } from '@view-models/game-history.vm';
import { Result } from '@view-models/common.vm';
import { MemberGamePointHistoryEntity } from '@entities/member-game-point-history.entity';
import { MemberEntity } from '@entities/member.entity';

type MemberGameItemParameter = {
    gameItemId: string
    memberGameItemId: string
}
export class MemberGamePointLibSvc extends BaseConnection {

    private memberId: string = null;

    private memberGamePointHistoryRepository: Repository<MemberGamePointHistoryEntity> = null;
    private memberRepository: Repository<MemberEntity> = null;

    constructor(memberId: string, queryRunner: QueryRunner) {
        super(queryRunner);
        this.memberId = memberId;



        this.memberGamePointHistoryRepository = this.entityManager.getRepository(MemberGamePointHistoryEntity)
        this.memberRepository = this.entityManager.getRepository(MemberEntity);
    }


    async addGamePointByGame(gamePoint: number, memberGameHistoryId: string): Promise<Result<PointHistoryVM>> {
        const ret = new Result<PointHistoryVM>(false);

        const memberEntity = await this.memberRepository.findOne(this.memberId)

        await this.memberGamePointHistoryRepository.insert({
            afterGamePoint: memberEntity.gamePoint + gamePoint,
            afterCarPlusPoint: memberEntity.carPlusPoint,
            beforeCarPlusPoint: memberEntity.carPlusPoint,
            beforeGamePoint: memberEntity.gamePoint,
            changeCarPlusPoint: 0,
            changeGamePoint: gamePoint,
            dateCreated: new Date(),
            description: '遊戲獲得',
            memberId: this.memberId,
            type: PointHistoryType.game,
            memberGameHistoryId
        })

        await this.entityManager.createQueryBuilder()
            .update<MemberEntity>(MemberEntity)
            .set({
                gamePoint: () => "game_point + :gamePoint"
            })
            .where({
                id: this.memberId
            }).setParameters({
                gamePoint
            }).execute()

        return ret.setResultValue(true);
    }

    async addGamePointByTransferFromCarPlusPoint(gamePoint: number, carPlusPoint: number, memberGameItemParam: MemberGameItemParameter): Promise<Result<PointHistoryVM>> {
        const ret = new Result<PointHistoryVM>(false);

        const memberEntity = await this.memberRepository.findOne(this.memberId)

        const changeCarPlusPoint: number = carPlusPoint * -1

        await this.memberGamePointHistoryRepository.insert({
            afterGamePoint: memberEntity.gamePoint + gamePoint,
            afterCarPlusPoint: memberEntity.carPlusPoint + changeCarPlusPoint,
            beforeCarPlusPoint: memberEntity.carPlusPoint,
            beforeGamePoint: memberEntity.gamePoint,
            changeCarPlusPoint: changeCarPlusPoint,
            changeGamePoint: gamePoint,
            dateCreated: new Date(),
            description: '由格上紅利轉換成遊戲點數',
            memberId: this.memberId,
            type: PointHistoryType.game,
            gameItemId: memberGameItemParam.gameItemId,
            memberGameHistoryId: memberGameItemParam.memberGameItemId
        })

        // await this.memberRepository.update({ id: this.memberId }, {
        //     gamePoint: Raw('game_point + ') as any,

        // })


        // return ret.setResultValue(true);




        return null;
    }

    async addCarPlusPointByTransferFromGamePoint(carPlusPoint: number, gamePoint: number, memberGameItemParam: MemberGameItemParameter): Promise<Result<PointHistoryVM>> {
        return null;
    }

    async minusGamePointByBuyGameItem(gamePoint: number, memberGameItemParam: MemberGameItemParameter): Promise<Result<PointHistoryVM>> {
        return null;
    }


}