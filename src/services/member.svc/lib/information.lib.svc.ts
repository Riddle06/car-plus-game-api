import { BaseConnection } from "@services/base-connection";
import { QueryRunner } from "typeorm";
import { Result, AppError, ResultCode } from "@view-models/common.vm";
import { MemberInformationVM, MemberUpdateInformationParameterVM } from "@view-models/member.vm";
import { MemberEntity } from "@entities/member.entity";
import { checker } from "@utilities";
import { carPlusSvc } from '../../car-plus.svc/index';

export class MemberInformationLibSvc extends BaseConnection {

    private memberId: string = null
    constructor(memberId: string, queryRunner: QueryRunner) {
        super(queryRunner);
        this.memberId = memberId;
    }

    async getInformation(): Promise<Result<MemberInformationVM>> {
        const ret = new Result<MemberInformationVM>();

        const memberRepository = await this.entityManager.getRepository(MemberEntity)
        const memberEntity = await memberRepository.findOne(this.memberId);

        if (checker.isNullOrUndefinedObject(memberEntity)) {
            throw new AppError(`不存在此會員`, ResultCode.resourceNotFound);
        }

        const { id, nickName, gamePoint, level, experience, carPlusMemberId } = memberEntity;

        let { carPlusPoint } = memberEntity;

        // 是否需要同步格上紅利
        const needSyncCarPlusPoint: boolean = false;

        if (needSyncCarPlusPoint) {
            const carPlusSystemPoint = await this.getCarPlusPoint(memberEntity.carPlusMemberId);
            if (carPlusPoint !== carPlusSystemPoint) {
                await this.entityManager.getRepository(MemberEntity).update({ id }, {
                    carPlusPoint: carPlusSystemPoint,
                    dateUpdated: new Date()
                })
                carPlusPoint = carPlusSystemPoint;
            }
        }

        ret.item = {
            id,
            nickName,
            carPlusPoint,
            gamePoint,
            level,
            experience,
            carPlusMemberId
        };

        return ret.setResultValue(true);
    }

    async getCarPlusPoint(carPlusMemberId: string): Promise<number> {

        // call store procedure 同步格上紅利
        const carPlusMemberInformation = await carPlusSvc.getCarPlusMemberInformation(carPlusMemberId);


        // TODO: 

        return 0;
    }

    async updateNickName(param: MemberUpdateInformationParameterVM): Promise<Result<MemberInformationVM>> {

        const memberRepository = await this.entityManager.getRepository(MemberEntity)

        const memberEntity = memberRepository.findOne(this.memberId);


        if (checker.isNullOrUndefinedOrWhiteSpace(param.nickName)) {
            throw new AppError(`暱稱不能空白`);
        }

        if (checker.isNullOrUndefinedObject(memberEntity)) {
            throw new AppError(`不存在此會員`);
        }

        await memberRepository.update({ id: this.memberId }, {
            ...param
        })

        return this.getInformation();
    }



}