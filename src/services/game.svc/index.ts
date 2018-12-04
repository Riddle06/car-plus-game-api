import { QueryRunner } from 'typeorm';
import { AdminUserEntity } from './../../entities/admin-user.entity';
import { MemberGameLibSvc } from './lib/member-game.lib.svc';
import { ListResult, Result, BaseResult } from "@view-models/common.vm";
import { GameItemVM, MemberBuyGameItemParameter, UseGameItemVM } from '@view-models/game.vm';
import { GameVM, MemberGameItemVM } from "@view-models/game.vm";
import { GameLibSvc } from "./lib/game.lib.svc";
import { dbProvider } from "@utilities";
import { MemberToken } from "@view-models/verification.vm";
import { PlayGameParameterVM, StartGameHistoryVM, ReportPlayGameParameterVM, PointHistoryVM } from "@view-models/game-history.vm";
import { MemberGameItemLibSvc } from "./lib/member-game-item.lib.svc";
import { MemberGamePointLibSvc } from "./lib/member-game-point.lib.svc";
import { CreateAdminMemberPointHistoryParameterVM } from '@view-models/admin.point.vm';

class GameSvc {
    async getGameList(): Promise<ListResult<GameVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const libGameSvc = new GameLibSvc(queryRunner)
            const ret = await libGameSvc.getGameList();
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async startGame(memberToken: MemberToken, param: PlayGameParameterVM): Promise<Result<StartGameHistoryVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberGameLibSvc = new MemberGameLibSvc(memberToken.payload.mi, queryRunner)
            const ret = await memberGameLibSvc.startGame(param);
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async reportGame(memberToken: MemberToken, param: ReportPlayGameParameterVM): Promise<Result<StartGameHistoryVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberGameLibSvc = new MemberGameLibSvc(memberToken.payload.mi, queryRunner)
            const memberGamePointLibSvc = new MemberGamePointLibSvc(memberToken.payload.mi, queryRunner)
            const ret = await memberGameLibSvc.reportGame(param, memberGamePointLibSvc);
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async getGameItems(memberToken: MemberToken): Promise<ListResult<GameItemVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const gameLibSvc = new GameLibSvc(queryRunner);
            const ret = await gameLibSvc.getGameItems(memberToken.payload.mi);
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }


    async getMemberItems(memberToken: MemberToken): Promise<ListResult<MemberGameItemVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberGameItemLibSvc = new MemberGameItemLibSvc(memberToken.payload.mi, queryRunner)
            const ret = await memberGameItemLibSvc.getMemberGameItems()
            await queryRunner.commitTransaction();
            return ret
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async memberUseGameItem(memberToken: MemberToken, memberGameItemId: string): Promise<BaseResult> {
        const memberId = memberToken.payload.mi;
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberGameItemLibSvc = new MemberGameItemLibSvc(memberId, queryRunner)
            const ret = await memberGameItemLibSvc.useGameItem(memberGameItemId)
            await queryRunner.commitTransaction();
            return ret
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async memberGetCurrentRole(memberId: string, queryRunner: QueryRunner): Promise<Result<GameItemVM>> {
        const memberGameItemLibSvc = new MemberGameItemLibSvc(memberId, queryRunner)
        const ret = await memberGameItemLibSvc.getCurrentGameItemRole()
        return ret
    }

    async memberBuyGameItem(memberToken: MemberToken, param: MemberBuyGameItemParameter): Promise<BaseResult> {
        const memberId = memberToken.payload.mi;
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberGameItemLibSvc = new MemberGameItemLibSvc(memberId, queryRunner)
            const memberGamePointLibSvc = new MemberGamePointLibSvc(memberId, queryRunner);
            const ret = await memberGameItemLibSvc.memberBuyGameItem(param, memberGamePointLibSvc)
            await queryRunner.commitTransaction();
            return ret
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async memberInitGameItem(memberId: string, queryRunner: QueryRunner): Promise<BaseResult> {
        const memberGameItemLibSvc = new MemberGameItemLibSvc(memberId, queryRunner)
        return await memberGameItemLibSvc.getMemberInitGameItem()
    }

    async memberGetUsableGameItems(memberToken: MemberToken): Promise<ListResult<UseGameItemVM>> {
        const memberId = memberToken.payload.mi;
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberGameItemLibSvc = new MemberGameItemLibSvc(memberId, queryRunner)
            const ret = await memberGameItemLibSvc.getMemberUsableGameItems()
            await queryRunner.commitTransaction();
            return ret
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async memberGetGameHistory(memberToken: MemberToken, id: string): Promise<Result<StartGameHistoryVM>> {
        const memberId = memberToken.payload.mi;
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberGameItemLibSvc = new MemberGameLibSvc(memberId, queryRunner)
            const ret = await memberGameItemLibSvc.getGameHistory(id)
            await queryRunner.commitTransaction();
            return ret
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async memberAddPointByManual(adminUserId: string, param: CreateAdminMemberPointHistoryParameterVM, queryRunner: QueryRunner): Promise<Result<PointHistoryVM>> {

        const { memberId, gamePoint, adminUserName, reason } = param;
        const memberGamePointLibSvc = new MemberGamePointLibSvc(memberId, queryRunner)
        const ret = await memberGamePointLibSvc.addGamePointByManual(gamePoint, reason, {
            adminUserId,
            adminUserName
        })

        return ret

    }

    async memberAddInitGamePoint(memberId: string, gamePoint: number, queryRunner: QueryRunner): Promise<Result<PointHistoryVM>> {
        const memberGamePointLibSvc = new MemberGamePointLibSvc(memberId, queryRunner)
        const ret = await memberGamePointLibSvc.addGamePointByFirstRegisterMember(gamePoint)
        return ret

    }


}



export const gameSvc = new GameSvc();