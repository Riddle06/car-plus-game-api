import { AdminMemberBlockListQueryParameterVM, AdminMemberListQueryParameterVM } from '@view-models/admin.member.vm';
import { PageQuery } from '@view-models/common.vm';
import { adminMemberSvc } from './../../services/admin.member.svc/index';
import { Router } from "express";
import MemberGameHistoryRouter from "./admin.member.game.history.router";
import MemberPointHistoryRouter from "./admin.member.point.history.router";
import { RequestExtension, ResponseExtension } from "@view-models/extension";


const router = Router();

router.use('/game', MemberGameHistoryRouter)

router.use('/point', MemberPointHistoryRouter)

// 會員列表
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {
    //TODO:可能不需要
    next();
})

// 取得
router.get('/with-game-items', async (req: RequestExtension, res: ResponseExtension, next) => {
    try {
        const param = new PageQuery<AdminMemberListQueryParameterVM>(req.listQuery, {
            memberId: req.query.mi ? req.query.mi : ""
        })
        res.result = await adminMemberSvc.getAdminMemberWidthGameItemsList(param)
    } catch (error) {
        res.appError = error;
    }
    next();
})

// 取得封鎖列表
router.get('/block-history', async (req: RequestExtension, res: ResponseExtension, next) => {
    try {

        const pageQuery = new PageQuery<AdminMemberBlockListQueryParameterVM>(req.listQuery, {
            memberId: req.query.memberId as string
        })
        res.result = await adminMemberSvc.getMemberBlockHistories(req.adminUserToken, pageQuery)
    } catch (error) {
        res.appError = error;
    }
    next();
})

// 新增黑名單
router.post('/block-history', async (req: RequestExtension, res: ResponseExtension, next) => {
    try {
        res.result = await adminMemberSvc.addMemberBlockHistory(req.adminUserToken, req.body)
    } catch (error) {
        res.appError = error;
    }
    next();
})

// 刪除黑名單
router.delete('/block-history/:id', async (req: RequestExtension, res: ResponseExtension, next) => {
    try {
        res.result = await adminMemberSvc.deleteMemberBlockHistory(req.adminUserToken, req.params.id)
    } catch (error) {
        res.appError = error;
    }
    next();
})

export default router;