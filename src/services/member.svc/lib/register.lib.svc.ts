import { variableSvc } from '@services/variable.svc';
import { carPlusSvc } from '@services/car-plus.svc';
import { AppError, Result } from '@view-models/common.vm';
import { BaseConnection } from '../../base-connection';
import { MemberInformationVM } from '@view-models/member.vm';
import { MemberEntity } from '../../../entities/member.entity';
import { uniqueId, checker } from '@utilities';
export class RegisterLibSvc extends BaseConnection {

    async createMemberByCarPlusId(carPlusMemberId: string): Promise<Result<MemberInformationVM>> {
        const ret = new Result<MemberInformationVM>();

        // 測試帳號
        const testCarPlusIdRegex = /^test__\S+/;

        const memberEntity = await this.entityManager.getRepository(MemberEntity).findOne({
            carPlusMemberId: carPlusMemberId
        })

        if (!checker.isNullOrUndefinedObject(memberEntity)) {
            throw new AppError(`此會員已存在`);
        }

        let carPlusPoint: number = 0
        if (!testCarPlusIdRegex.test(carPlusMemberId)) {
            const carPlusMemberInformationRet = await carPlusSvc.getCarPlusMemberInformation(carPlusMemberId);
            if (checker.isNullOrUndefinedObject(carPlusMemberInformationRet) || !carPlusMemberInformationRet.success) {
                throw new AppError(`此會員不存在格上系統中`);
            }
            carPlusPoint = carPlusMemberInformationRet.item.carPlusPoint;
        }

        const newMemberInitPointRet = await variableSvc.getFirstLoginGiveGamePointAmount()
        const newMemberInitPoint = newMemberInitPointRet.item;
        const newMemberEntity = new MemberEntity();

        newMemberEntity.id = uniqueId.generateV4UUID();
        newMemberEntity.carPlusMemberId = carPlusMemberId;
        newMemberEntity.carPlusPoint = carPlusPoint;
        newMemberEntity.dateCreated = new Date();
        newMemberEntity.dateUpdated = new Date();
        newMemberEntity.experience = 0;
        newMemberEntity.gamePoint = newMemberInitPoint
        newMemberEntity.level = 1
        newMemberEntity.nickName = ''


        await this.entityManager.getRepository(MemberEntity).insert(newMemberEntity);

        ret.item = {
            carPlusMemberId: newMemberEntity.carPlusMemberId,
            carPlusPoint: newMemberEntity.carPlusPoint,
            gamePoint: newMemberEntity.gamePoint,
            experience: newMemberEntity.experience,
            id: newMemberEntity.id,
            level: newMemberEntity.level,
            nickName: newMemberEntity.nickName
        }

        return ret.setResultValue(true);
    }




} 