import { adminGameSvc } from '@services/admin.game.svc';
import { Router } from 'express';
import { RequestExtension, ResponseExtension } from '@view-models/extension';
import { PageQuery } from '@view-models/common.vm';
import { AdminMemberGameHistoryParameterVM } from '@view-models/admin.game.vm';
import { adminPointSvc, adminMemberSvc } from '@services';
import { AdminMemberGameItemQueryParameterVM } from '@view-models/admin.point.vm';
import { AdminMemberListQueryParameterVM } from '@view-models/admin.member.vm';
const router = Router();

router.get('/dashboard', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const query = new PageQuery(req.listQuery);
        const ret = await adminGameSvc.exportGameDashboard(query);
        res.exportResult = ret;
    } catch (error) {
        res.appError = error;
    }

    next();
})

router.get('/member/game/history', async (req: RequestExtension, res: ResponseExtension, next) => {
    try {
        const param = new PageQuery<AdminMemberGameHistoryParameterVM>(req.listQuery, {
            memberId: req.query.mi ? req.query.mi : ""
        })
        res.exportResult = await adminGameSvc.exportGameHistory(param);
    } catch (error) {
        res.appError = error;
    }

    next();
})

router.get('/member/point/history', async (req: RequestExtension, res: ResponseExtension, next) => {
    try {
        const param = new PageQuery<AdminMemberGameItemQueryParameterVM>(req.listQuery, {
            memberId: req.query.mi,
            shortId: req.query.shortId
        })
        res.exportResult = await adminPointSvc.exportExchangeOrders(param)
    } catch (error) {
        res.appError = error;
    }

    next();
})

router.get('/member/with-game-items', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const param = new PageQuery<AdminMemberListQueryParameterVM>(req.listQuery, {
            memberId: req.query.mi ? req.query.mi : "",
            keyword: req.query.keyword,
            shortId: req.query.shortId
        })
        res.exportResult = await adminMemberSvc.exportAdminMemberWidthGameItemsListExcel(param)

    } catch (error) {
        res.appError = error;
    }

    next();
})

export default router