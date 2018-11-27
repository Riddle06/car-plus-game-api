import { PageQuery } from './../../view-models/common.vm';
import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { adminGameSvc } from '@services/admin.game.svc';

const router = Router();

// 營運報表
router.get('/dashboard', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const query = new PageQuery(req.listQuery);
        const ret = await adminGameSvc.getGameDashboard(query)
        res.result = ret;
    } catch (error) {
        res.appError = error;
    }

    next();
})

// 營運報表 excel 匯出
router.get('/dashboard/excel', async (req: RequestExtension, res: ResponseExtension, next) => {
    //TODO:
    next();
})

export default router;