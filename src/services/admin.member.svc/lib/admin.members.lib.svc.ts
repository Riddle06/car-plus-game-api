import { MemberGameItemEntity } from '@entities/member-game-item.entity';
import { AppError, QueryCountDbModel } from '@view-models/common.vm';
import { MemberEntity } from '@entities/member.entity';
import { ListResult, PageQuery, Result } from '@view-models/common.vm';
import { AdminMemberVM, AdminMemberListQueryParameterVM, AdminMemberGameItemVM } from '@view-models/admin.member.vm';
import { BaseConnection } from '@services/base-connection';
import { ExportResult, exporter } from '@utilities/exporter';
import { checker, uniqueId } from '@utilities';
import { GameItemVM } from '@view-models/game.vm';
import { GameItemEntity } from '@entities/game-item.entity';

const baseSql = `select 
m.id as id,
m.nick_name as nickName,
m.car_plus_point as carPlusPoint,
m.game_point as gamePoint,
m.level as level,
m.experience as experience,
m.car_plus_member_id as carPlusMemberId,
ROW_NUMBER () OVER ( order by m.car_plus_member_id asc) as row
from member as m`

type MemberDbViewModel = {
    id: string
    nickName: string
    gamePoint: number
    carPlusPoint: number
    dateCreated: Date
    carPlusMemberId: string
    experience: number
    level: number
    isBlock: boolean
}

type MemberWithGameItem = {
    id: string
    nickName: string
    gamePoint: number
    carPlusPoint: number
    dateCreated: Date
    carPlusMemberId: string
    experience: number
    level: number
    isBlock: boolean
    gameItem1Count: number
    gameItem2Count: number
    gameItem3Count: number
    gameItem4Count: number
    gameItem5Count: number
    gameItem6Count: number
    gameItem7Count: number

}
export class AdminMembersLibSvc extends BaseConnection {

    async getMembers(param: PageQuery<AdminMemberListQueryParameterVM>): Promise<ListResult<AdminMemberVM>> {
        const conditions: string[] = ['1 = 1'];
        const parameters: any = {};

        if (!checker.isNullOrUndefinedOrWhiteSpace(param.params.memberId)) {
            conditions.push(`m.id = :memberId`)
            parameters.memberId = param.params.memberId
        }

        if (!checker.isNullOrUndefinedOrWhiteSpace(param.params.keyword)) {
            conditions.push(`(m.nick_name like :keyword or m.car_plus_member_id like :keyword)`)
            parameters.keyword = `%${param.params.keyword}%`;
        }

        const sqlWithConditions = `${baseSql} where ${conditions.join(' and ')}`

        const paginationSql = this.getPaginationSql(sqlWithConditions);
        const countSql = this.getCountSql(sqlWithConditions);

        const rowStart: number = ((param.listQueryParam.pageIndex - 1) * param.listQueryParam.pageSize) + 1;
        const rowEnd: number = rowStart + param.listQueryParam.pageSize - 1;
        parameters.rowStart = rowStart;
        parameters.rowEnd = rowEnd;

        const paginationQueryParam = this.parseSql(paginationSql, parameters)
        const countQueryParam = this.parseSql(countSql, parameters)

        const listRet: MemberDbViewModel[] = await this.entityManager.query(paginationQueryParam.sql, paginationQueryParam.parameters);
        const countRet: QueryCountDbModel = await this.entityManager.query(countQueryParam.sql, countQueryParam.parameters);


        const memberEntities = listRet
        const dataAmount = countRet[0].count

        const ret = new ListResult<AdminMemberVM>(true);

        ret.items = memberEntities.map(entity => {
            const { id, carPlusMemberId, dateCreated, level, gamePoint, nickName, experience, carPlusPoint } = entity
            const item: AdminMemberVM = {
                id,
                nickName,
                carPlusPoint,
                gamePoint,
                level,
                experience,
                carPlusMemberId,
                gameItems: [],
                currentRoleGameItem: null
            }
            return item
        })

        ret.page = {
            pageAmount: Math.ceil(dataAmount / param.listQueryParam.pageSize),
            dataAmount
        }

        return ret;
    }

    async getMemberDetail(id: string): Promise<Result<AdminMemberVM>> {
        const memberRepository = this.entityManager.getRepository(MemberEntity)

        if (!uniqueId.isUUID(id)) {
            throw new AppError('參數驗證錯誤 :id ')
        }

        const memberEntity = await memberRepository.findOne(id);

        if (checker.isNullOrUndefinedObject(memberEntity)) {
            throw new AppError('查無此會員')
        }

        const ret = new Result<AdminMemberVM>(true);
        const { carPlusMemberId, level, gamePoint, nickName, experience, carPlusPoint } = memberEntity

        ret.item = {
            id,
            nickName,
            carPlusPoint,
            gamePoint,
            level,
            experience,
            carPlusMemberId,
            gameItems: [],
            currentRoleGameItem: null
        }

        const memberGameItemRepository = this.entityManager.getRepository(MemberGameItemEntity);

        const gameItemAggregations: { gameItemId: string, count: number }[] = await memberGameItemRepository.createQueryBuilder(`memberGameItem`)
            .select(`memberGameItem.game_item_id`, 'gameItemId')
            .select(`sum(memberGameItem.remain_times)`, `count`)
            .where(`memberGameItem.member_id = :memberId`)
            .groupBy('memberGameItem.game_item_id')
            .setParameters({ memberId: id })
            .getRawMany()

        const gameItems = await this.getGameItems();

        ret.item.gameItems = gameItems.items.map(item => {
            const { id, description, name, imageUrl, type, enableBuy, addScoreRate, addGamePointRate, spriteFolderPath, levelMinLimit } = item
            const memberGameItem: AdminMemberGameItemVM = {
                id,
                description,
                name,
                imageUrl,
                gamePoint,
                carPlusPoint,
                type,
                enableBuy,
                addScoreRate,
                addGamePointRate,
                num: 0,
                spriteFolderPath,
                levelMinLimit
            }
            const gameItemAggregation = gameItemAggregations.find(gameItemAggregation => gameItemAggregation.gameItemId === id)
            if (!checker.isNullOrUndefinedObject(gameItemAggregation)) {
                memberGameItem.num = gameItemAggregation.count
            }
            return memberGameItem;
        });

        return ret;
    }

    async exportMembersWithGameItemsExcel(param: PageQuery<AdminMemberListQueryParameterVM>): Promise<ExportResult> {

        const data: MemberWithGameItem[] = await this.entityManager.query(`
            select 
            m.id as id,
            m.nick_name as nickName,
            m.game_point as gamePoint,
            m.car_plus_point as carPlusPoint,
            m.car_plus_member_id as carPlusMemberId,
            m.date_created as dateCreated,
            m.experience as experience,
            m.level as level,
            m.is_block as isBlock,
            isnull(game_item_1.count,0) as gameItem1Count,
            isnull(game_item_2.count,0) as gameItem2Count,
            isnull(game_item_3.count,0) as gameItem3Count,
            isnull(game_item_4.count,0) as gameItem4Count,
            isnull(game_item_5.count,0) as gameItem5Count,
            isnull(game_item_6.count,0) as gameItem6Count,
            isnull(game_item_7.count,0) as gameItem7Count
                from [member] m 
                left join (
                select i.member_id, sum(i.remain_times) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '一般上班族'
                group by i.member_id ) as game_item_1 on game_item_1.member_id = m.id
                
                left join (
                select i.member_id, sum(i.remain_times) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '實習超人'
                group by i.member_id ) as game_item_2 on game_item_2.member_id = m.id
                
                left join (
                select i.member_id, sum(i.remain_times) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '超人隊員'
                group by i.member_id ) as game_item_3 on game_item_3.member_id = m.id
                
                left join (
                select i.member_id, sum(i.remain_times) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '超人隊長'
                group by i.member_id ) as game_item_4 on game_item_4.member_id = m.id
                
                left join (
                select i.member_id, sum(i.remain_times) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '力霸超人'
                group by i.member_id ) as game_item_5 on game_item_5.member_id = m.id
                
                left join (
                select i.member_id, sum(i.remain_times) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '富翁果實'
                group by i.member_id ) as game_item_6 on game_item_6.member_id = m.id
                
                left join (
                select i.member_id, sum(i.remain_times) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '能量果實'
            group by i.member_id ) as game_item_7 on game_item_7.member_id = m.id
            order by m.car_plus_member_id asc
       `)


        return exporter.exportByFieldDicAndData({
            data,
            fieldNameDic: {
                id: "ID",
                nickName: "暱稱",
                gamePoint: "超人幣",
                carPlusPoint: "格上紅利",
                dateCreated: "遊戲帳號建立時間",
                carPlusMemberId: "格上ID",
                experience: "目前經驗值",
                level: "等級",
                isBlock: "是否為黑名單",
                gameItem1Count: "一般上班族",
                gameItem2Count: "實習超人",
                gameItem3Count: "超人隊員",
                gameItem4Count: "超人隊長",
                gameItem5Count: "力霸超人",
                gameItem6Count: "富翁果實",
                gameItem7Count: "能量果實",
            },
            fileName: '會員總覽',
            sheetName: 'sheet1'
        })
    }

    async getGameItems(): Promise<ListResult<GameItemVM>> {
        const gameItemRepository = await this.entityManager.getRepository(GameItemEntity);

        const gameItemEntities = await gameItemRepository.find({
            where: {

            },
            order: {
                type: "ASC",
                gamePoint: "ASC"
            }
        })

        const ret = new ListResult<GameItemVM>();
        ret.items = gameItemEntities.map(gameItemEntity => {
            const { id, description, name, imageUrl, gamePoint, carPlusPoint, type, spriteFolderPath,levelMinLimit } = gameItemEntity
            const gameItemVM: GameItemVM = {
                id,
                description,
                name,
                imageUrl,
                gamePoint,
                carPlusPoint,
                type,
                enableBuy: true,
                spriteFolderPath,
                levelMinLimit
            }

            return gameItemVM;
        })

        return ret.setResultValue(true);
    }

}