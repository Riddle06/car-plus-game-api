import { ListResult, PageQuery } from '@view-models/common.vm';
import { AdminMemberVM, AdminMemberListQueryParameterVM } from '@view-models/admin.member.vm';
import * as xlsx from "xlsx";
import { BaseConnection } from '@services/base-connection';
import { ResponseExtension } from '@view-models/extension';
import { ExportResult, exporter } from '@utilities/exporter';

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




        return null;
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
                select i.member_id, count(i.id) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '一般上班族'
                group by i.member_id ) as game_item_1 on game_item_1.member_id = m.id
                
                left join (
                select i.member_id, count(i.id) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '實習超人'
                group by i.member_id ) as game_item_2 on game_item_2.member_id = m.id
                
                left join (
                select i.member_id, count(i.id) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '超人隊員'
                group by i.member_id ) as game_item_3 on game_item_3.member_id = m.id
                
                left join (
                select i.member_id, count(i.id) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '超人隊長'
                group by i.member_id ) as game_item_4 on game_item_4.member_id = m.id
                
                left join (
                select i.member_id, count(i.id) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '力霸超人'
                group by i.member_id ) as game_item_5 on game_item_5.member_id = m.id
                
                left join (
                select i.member_id, count(i.id) as [count] from member_game_item i 
                left join game_item gi on gi.id = i.game_item_id 
                where gi.name = '富翁果實'
                group by i.member_id ) as game_item_6 on game_item_6.member_id = m.id
                
                left join (
                select i.member_id, count(i.id) as [count] from member_game_item i 
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

}