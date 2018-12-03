import { MemberLoginDailyHistory } from './../../../entities/member-login-daily-history.entity';
import { MemberToken, MemberTokenPayload, MemberTokenHeader } from 'view-models/verification.vm';
import { MemberEntity } from './../../../entities/member.entity';
import { RegisterLibSvc } from './register.lib.svc';
import { checker } from '@utilities';
import { BaseConnection } from "@services/base-connection";
import { MemberLoginCreateParameterVM } from "@view-models/member.vm";
import { Result, AppError } from "@view-models/common.vm";
import { QueryRunner, Not } from 'typeorm';
import { MemberLoginEntity } from '@entities/member-login.entity';
import * as jwt from "jsonwebtoken";
import * as luxon from "luxon";
import { configurations } from '@configuration';

export class MemberLoginLibSvc extends BaseConnection {

    private registerLibSvc: RegisterLibSvc = null


    constructor(queryRunner: QueryRunner, registerLibSvc: RegisterLibSvc) {
        super(queryRunner);
        this.registerLibSvc = registerLibSvc
    }

    async create(param: MemberLoginCreateParameterVM): Promise<Result<string>> {
        const ret = new Result<string>();

        const { clientId, carPlusMemberId } = param;

        if (checker.isNullOrUndefinedOrWhiteSpace(clientId)) {
            throw new AppError('請輸入裝置識別值')
        }

        if (checker.isNullOrUndefinedOrWhiteSpace(carPlusMemberId)) {
            throw new AppError('請輸入格上會員識別值')
        }

        const memberRepository = this.entityManager.getRepository(MemberEntity)

        let memberEntity: MemberEntity = await memberRepository.findOne({ carPlusMemberId });

        const isExistInMember: boolean = !checker.isNullOrUndefinedObject(memberEntity);

        // 若會員不存在則要幫他建立資料
        if (!isExistInMember) {
            const createMemberRet = await this.registerLibSvc.createMemberByCarPlusId(carPlusMemberId);
            memberEntity = await this.entityManager.getRepository(MemberEntity).findOne(createMemberRet.item.id)
        }

        const memberLoginRepository = await this.entityManager.getRepository(MemberLoginEntity)
        let memberLoginEntity: MemberLoginEntity = await memberLoginRepository.findOne({ memberId: memberEntity.id, clientId })
        let isLoginHistoryExist: boolean = !checker.isNullOrUndefinedObject(memberLoginEntity);

        // 如果不存在此裝置且是此帳號的登入紀錄，則要幫他建立
        if (!isLoginHistoryExist) {
            await memberLoginRepository.insert({
                clientId,
                memberId: memberEntity.id,
                dateCreated: new Date(),
                dateLastLogout: new Date(),
                dateUpdated: new Date(),
                isLogout: false
            });
            memberLoginEntity = await memberLoginRepository.findOne({ memberId: memberEntity.id, clientId })
        }

        // 將此帳號登入
        await memberLoginRepository.update({ clientId, memberId: memberEntity.id }, {
            isLogout: false,
            dateUpdated: new Date()
        })

        // 將使用此裝置的其他帳號登出
        await memberLoginRepository.update({
            isLogout: false,
            clientId,
            memberId: Not(memberEntity.id)
        }, { isLogout: true, dateLastLogout: new Date() })

        // 登入日結算
        await this.recordDailyHistory(memberEntity.id)

        const tokenPayload: MemberTokenPayload = {
            ci: clientId,
            cpmi: carPlusMemberId,
            exp: luxon.DateTime.local().endOf('day').toMillis(),
            iat: (new Date()).getTime(),
            iss: 'car-plus-game',
            mi: memberEntity.id
        }

        const tokenHeader: MemberTokenHeader = {
            alg: "HS256",
            typ: "JWT"
        };

        const signature = jwt.sign(tokenPayload, configurations.token.securityKey, { header: tokenHeader })

        ret.item = signature;

        return ret.setResultValue(true)
    }

    private async recordDailyHistory(memberId: string): Promise<void> {
        const memberLoginDailyHistoryRepository = this.entityManager.getRepository(MemberLoginDailyHistory);
        const dateRecord = luxon.DateTime.local().startOf('day').toJSDate();

        const memberDailyHistoryEntity = await memberLoginDailyHistoryRepository.findOne({
            where: {
                memberId,
                dateRecord
            }
        })

        if (checker.isNullOrUndefinedObject(memberDailyHistoryEntity)) {

            await memberLoginDailyHistoryRepository.insert({
                memberId,
                dateRecord,
                dateCreated: new Date(),
                dateUpdated: new Date(),
                loginTimes: 1
            })

        } else {
            await this.entityManager.createQueryBuilder()
                .update<MemberLoginDailyHistory>(MemberLoginDailyHistory)
                .set({
                    dateUpdated: new Date(),
                    loginTimes: () => "login_times + 1"
                })
                .where({
                    memberId,
                    dateRecord
                }).execute()
        }
    }

}