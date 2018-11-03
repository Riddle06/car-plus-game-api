import { uniqueId } from '@utilities';
import { BaseConnection } from '@services/base-connection';
import { QueryRunner, Repository, Raw } from 'typeorm';
import { PointHistoryVM, PointHistoryType } from '@view-models/game-history.vm';
import { Result } from '@view-models/common.vm';
import { MemberGamePointHistoryEntity } from '@entities/member-game-point-history.entity';
import { MemberEntity } from '@entities/member.entity';
import { carPlusSvc } from '../../car-plus.svc/index';

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

    /**
     * 因為玩遊戲獲得的點數
     * @param gamePoint 
     * @param memberGameHistoryId 
     */
    async addGamePointByGame(gamePoint: number, memberGameHistoryId: string): Promise<Result<PointHistoryVM>> {
        const ret = new Result<PointHistoryVM>(false);

        const memberEntity = await this.memberRepository.findOne(this.memberId)

        const pointHistory = new MemberGamePointHistoryEntity();

        pointHistory.id = uniqueId.generateV4UUID();
        pointHistory.beforeCarPlusPoint = memberEntity.carPlusPoint;
        pointHistory.changeCarPlusPoint = 0
        pointHistory.afterCarPlusPoint = memberEntity.carPlusPoint;
        pointHistory.beforeGamePoint = memberEntity.gamePoint;
        pointHistory.changeGamePoint = gamePoint;
        pointHistory.afterGamePoint = memberEntity.gamePoint + gamePoint;
        pointHistory.dateCreated = new Date()
        pointHistory.description = `遊戲獲得`
        pointHistory.memberId = this.memberId
        pointHistory.type = PointHistoryType.game
        pointHistory.memberGameHistoryId = memberGameHistoryId;

        await this.memberGamePointHistoryRepository.insert(pointHistory)

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

        ret.item = this.parseMemberGamePointHistoryToHistoryVM(pointHistory);

        return ret.setResultValue(true);
    }

    /**
     * 用格上紅利換得的遊戲點數
     * @param gamePoint 
     * @param carPlusPoint 
     * @param memberGameItemParam 
     */
    async addGamePointByTransferFromCarPlusPoint(gamePoint: number, carPlusPoint: number, memberGameItemParam: MemberGameItemParameter): Promise<Result<PointHistoryVM>> {
        const ret = new Result<PointHistoryVM>(false);
        const memberEntity = await this.memberRepository.findOne(this.memberId)
        const changeCarPlusPoint: number = carPlusPoint * -1;

        const pointHistory = new MemberGamePointHistoryEntity();
        pointHistory.id = uniqueId.generateV4UUID();
        pointHistory.afterGamePoint = memberEntity.gamePoint + gamePoint;
        pointHistory.beforeCarPlusPoint = memberEntity.carPlusPoint;
        pointHistory.changeCarPlusPoint = changeCarPlusPoint;
        pointHistory.afterCarPlusPoint = memberEntity.carPlusPoint + changeCarPlusPoint;
        pointHistory.beforeGamePoint = memberEntity.gamePoint;
        pointHistory.changeGamePoint = gamePoint;
        pointHistory.dateCreated = new Date();
        pointHistory.description = '由格上紅利轉換成遊戲點數';
        pointHistory.memberId = this.memberId;
        pointHistory.type = PointHistoryType.carPlusPointTransferToGamePoint;
        pointHistory.gameItemId = memberGameItemParam.gameItemId;
        pointHistory.memberGameItemId = memberGameItemParam.memberGameItemId;

        await this.memberGamePointHistoryRepository.insert(pointHistory);

        await this.entityManager.createQueryBuilder()
            .update<MemberEntity>(MemberEntity)
            .set({
                gamePoint: () => "game_point + :gamePoint",
                carPlusPoint: () => "car_pus_point - :carPlusPoint"
            })
            .where({
                id: this.memberId
            }).setParameters({
                gamePoint,
                carPlusPoint
            }).execute()

        await carPlusSvc.plusCarPlusPoint(memberEntity.carPlusMemberId, changeCarPlusPoint)

        ret.item = this.parseMemberGamePointHistoryToHistoryVM(pointHistory);


        return ret.setResultValue(true);
    }

    /**
     * 用遊戲點數更換格上紅利
     */
    async addCarPlusPointByTransferFromGamePoint(carPlusPoint: number, gamePoint: number, memberGameItemParam: MemberGameItemParameter): Promise<Result<PointHistoryVM>> {
        const ret = new Result<PointHistoryVM>(false);

        const memberEntity = await this.memberRepository.findOne(this.memberId)
        const changeGamePoint = gamePoint * -1;

        const pointHistory = new MemberGamePointHistoryEntity();
        pointHistory.id = uniqueId.generateV4UUID();
        pointHistory.beforeCarPlusPoint = memberEntity.carPlusPoint;
        pointHistory.changeCarPlusPoint = carPlusPoint;
        pointHistory.afterCarPlusPoint = memberEntity.carPlusPoint + carPlusPoint;
        pointHistory.beforeGamePoint = memberEntity.gamePoint;
        pointHistory.changeGamePoint = changeGamePoint;
        pointHistory.afterGamePoint = memberEntity.gamePoint + changeGamePoint;
        pointHistory.dateCreated = new Date();
        pointHistory.description = '遊戲點數轉換成格上紅利';
        pointHistory.memberId = this.memberId;
        pointHistory.type = PointHistoryType.gamePointTransferToCarPlusPoint;
        pointHistory.gameItemId = memberGameItemParam.gameItemId;
        pointHistory.memberGameItemId = memberGameItemParam.memberGameItemId;

        await this.memberGamePointHistoryRepository.insert(pointHistory);

        await this.entityManager.createQueryBuilder()
            .update<MemberEntity>(MemberEntity)
            .set({
                gamePoint: () => "game_point - :gamePoint",
                carPlusPoint: () => "car_pus_point + :carPlusPoint"
            })
            .where({
                id: this.memberId
            }).setParameters({
                gamePoint,
                carPlusPoint
            }).execute();

        await carPlusSvc.plusCarPlusPoint(memberEntity.carPlusMemberId, carPlusPoint);

        ret.item = this.parseMemberGamePointHistoryToHistoryVM(pointHistory);

        return ret.setResultValue(true);
    }

    /**
     * 用遊戲點數買道具
     */
    async minusGamePointByBuyGameItem(gamePoint: number, memberGameItemParam: MemberGameItemParameter): Promise<Result<PointHistoryVM>> {
        const ret = new Result<PointHistoryVM>(false);

        const memberEntity = await this.memberRepository.findOne(this.memberId)
        const changeGamePoint = gamePoint * -1;

        const pointHistory = new MemberGamePointHistoryEntity();
        pointHistory.id = uniqueId.generateV4UUID();
        pointHistory.beforeCarPlusPoint = memberEntity.carPlusPoint;
        pointHistory.changeCarPlusPoint = 0;
        pointHistory.afterCarPlusPoint = memberEntity.carPlusPoint;
        pointHistory.beforeGamePoint = memberEntity.gamePoint;
        pointHistory.changeGamePoint = changeGamePoint;
        pointHistory.afterGamePoint = memberEntity.gamePoint + changeGamePoint;
        pointHistory.dateCreated = new Date();
        pointHistory.description = '用遊戲點數購物商城道具';
        pointHistory.memberId = this.memberId;
        pointHistory.type = PointHistoryType.gamePointTransferToGameItem;
        pointHistory.gameItemId = memberGameItemParam.gameItemId;
        pointHistory.memberGameItemId = memberGameItemParam.memberGameItemId;

        await this.memberGamePointHistoryRepository.insert(pointHistory);

        await this.entityManager.createQueryBuilder()
            .update<MemberEntity>(MemberEntity)
            .set({
                gamePoint: () => "game_point - :gamePoint",
            })
            .where({
                id: this.memberId
            }).setParameters({
                gamePoint,
            }).execute();

        ret.item = this.parseMemberGamePointHistoryToHistoryVM(pointHistory);

        return ret.setResultValue(true);
    }


    private parseMemberGamePointHistoryToHistoryVM(memberGamePointHistoryEntity: MemberGamePointHistoryEntity): PointHistoryVM {

        const { id, type, dateCreated, description, gameItemId, memberGameItemId, beforeGamePoint, afterGamePoint
            , changeGamePoint, beforeCarPlusPoint, afterCarPlusPoint, changeCarPlusPoint } = memberGamePointHistoryEntity;

        const ret: PointHistoryVM = {
            id,
            type,
            dateCreated,
            description,
            gameItemId,
            memberGameItemId,
            beforeGamePoint,
            afterGamePoint,
            changeGamePoint,
            beforeCarPlusPoint,
            afterCarPlusPoint,
            changeCarPlusPoint,
        }

        return ret;
    }


}