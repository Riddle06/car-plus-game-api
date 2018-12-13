import { PageQuery } from './../../view-models/common.vm';
import { adminPointSvc } from './../../services/admin.point.svc/index';
import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { AdminMemberGameItemQueryParameterVM } from '@view-models/admin.point.vm';

const router = Router();

// 兌換紀錄
router.get('/history/exchange', async (req: RequestExtension, res: ResponseExtension, next) => {
    try {
        const param = new PageQuery<AdminMemberGameItemQueryParameterVM>(req.listQuery, {
            memberId: req.query.mi
            
        })
        res.result = await adminPointSvc.getExchangeOrders(param)
    } catch (error) {
        res.appError = error;
    }
    next();
})

// 客訴補點紀錄
router.get('/history/manual', async (req: RequestExtension, res: ResponseExtension, next) => {
    try {
        // const param = new PageQuery(req.listQuery);

        const param = new PageQuery<AdminMemberGameItemQueryParameterVM>(req.listQuery, {
            memberId: req.query.mi
        })

        res.result = await adminPointSvc.getManualGamePointHistories(req.adminUserToken, param)
    } catch (error) {
        res.appError = error;
    }
    next();
})

// 客訴補幣
router.post('/', async (req: RequestExtension, res: ResponseExtension, next) => {
    try {
        res.result = await adminPointSvc.addPoint(req.adminUserToken, req.body)
    } catch (error) {
        res.appError = error;
    }
    next();
})

export default router;