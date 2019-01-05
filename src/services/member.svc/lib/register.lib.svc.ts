import { variableSvc } from '@services/variable.svc';
import { carPlusSvc } from '@services/car-plus.svc';
import { AppError, Result } from '@view-models/common.vm';
import { BaseConnection } from '../../base-connection';
import { MemberInformationVM } from '@view-models/member.vm';
import { MemberEntity } from '../../../entities/member.entity';
import { uniqueId, checker, system } from '@utilities';
import { gameSvc } from '@services';
export class RegisterLibSvc extends BaseConnection {

    async createMemberByCarPlusId(carPlusMemberId: string): Promise<Result<MemberInformationVM>> {
        const ret = new Result<MemberInformationVM>();

        // 測試帳號
        const testCarPlusIdRegex = variableSvc.getTesterRegExp();

        const memberEntity = await this.entityManager.getRepository(MemberEntity).findOne({
            carPlusMemberId: carPlusMemberId
        })

        if (!checker.isNullOrUndefinedObject(memberEntity)) {
            throw new AppError(`此會員已存在`);
        }

        let carPlusPoint: number = 0
        if (!testCarPlusIdRegex.test(carPlusMemberId)) {
            const carPlusMemberInformationRet = await carPlusSvc.getCarPlusMemberInformation(carPlusMemberId, this.queryRunner);
            if (checker.isNullOrUndefinedObject(carPlusMemberInformationRet) || !carPlusMemberInformationRet.success) {
                throw new AppError(`此會員不存在格上系統中`);
            }
            carPlusPoint = carPlusMemberInformationRet.item.carPlusPoint;
        }

        const newMemberInitPointRet = await variableSvc.getFirstLoginGiveGamePointAmount()
        const newMemberEntity = new MemberEntity();

        newMemberEntity.id = uniqueId.generateV4UUID();
        newMemberEntity.carPlusMemberId = carPlusMemberId;
        newMemberEntity.carPlusPoint = carPlusPoint;
        newMemberEntity.dateCreated = new Date();
        newMemberEntity.dateUpdated = new Date();
        newMemberEntity.experience = 0;
        newMemberEntity.gamePoint = 0;
        newMemberEntity.level = 1
        newMemberEntity.nickName = '';

        await this.entityManager.getRepository(MemberEntity).insert(newMemberEntity);

        // 初始化點數 100 點
        await gameSvc.memberAddInitGamePoint(newMemberEntity.id, newMemberInitPointRet.item, this.queryRunner)

        // 新增一般上班族
        await gameSvc.memberInitGameItem(newMemberEntity.id, this.queryRunner)

        const currentRoleRet = await gameSvc.memberGetCurrentRole(newMemberEntity.id, this.queryRunner)

        const levelInfo = await variableSvc.getLevelInformation()
        const experienceLimit = variableSvc.getExperienceLimit(newMemberEntity.level, levelInfo.items);

        const shortId: string = await this.getMemberShortId();
        ret.item = {
            carPlusMemberId: newMemberEntity.carPlusMemberId,
            carPlusPoint: newMemberEntity.carPlusPoint,
            gamePoint: newMemberEntity.gamePoint,
            experience: newMemberEntity.experience,
            id: newMemberEntity.id,
            level: newMemberEntity.level,
            nickName: newMemberEntity.nickName,
            currentRoleGameItem: currentRoleRet.item,
            shortId,
            experienceLimit
        }

        return ret.setResultValue(true);
    }


    async handleEmptyShortIdMembers(): Promise<void> {
        const memberRepository = await this.entityManager.getRepository(MemberEntity);
        const memberEntities = await memberRepository.find({
            shortId: ''
        })

        console.log(`need update empty shortId : ${memberEntities.length} rows`)

        for (const member of memberEntities) {
            const shortId = await this.getMemberShortId();
            await memberRepository.update({ id: member.id }, {
                shortId: shortId
            })

        }

        return;
    }

    async getMemberShortId(): Promise<string> {

        const memberRepository = await this.entityManager.getRepository(MemberEntity)
        const count = await memberRepository.count();

        do {
            const shortId = await uniqueId.getRandomCode(count);
            const existCount = await memberRepository.count({
                where: {
                    shortId
                }
            });
            if (existCount === 0) {
                return shortId;
            }
            await system.sleep(1);
        } while (true);

    }


} 