import { ListResult, PageQuery } from '@view-models/common.vm';
import { AdminMemberVM, AdminMemberListQueryParameterVM } from '@view-models/admin.member.vm';
import * as xlsx from "xlsx";
import { BaseConnection } from '@services/base-connection';
import { ResponseExtension } from '@view-models/extension';

const excelFieldName = {

}
export class AdminMembersLibSvc extends BaseConnection {

    async getMembers(param: PageQuery<AdminMemberListQueryParameterVM>): Promise<ListResult<AdminMemberVM>> {




        return null;
    }

    async exportMembersWithGameItemsExcel(res: ResponseExtension) {

        const queryRet = await this.entityManager.query(`
select 

m.id as id,
m.nick_name as nickName,
m.game_point as gamePoint,
m.car_plus_point as carPlusPoint,
m.date_created as dateCreated,
m.car_plus_member_id as carPlusMemberId,
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
       `)



        // const workSheet = xlsx.utils.aoa_to_sheet([["a", "b"], [1, 2]]);
        const sheet = xlsx.utils.json_to_sheet(queryRet)
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, sheet, 'sheet1')

        const buffer = xlsx.write(workbook, {
            type: 'buffer'
        })

        res.end(buffer);

        console.log(`queryRet`, queryRet)
    }

}