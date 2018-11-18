import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { adminGameSvc } from "@services/admin.game.svc";
import { PageQuery } from "@view-models/common.vm";
import { AdminMemberGameHistoryParameterVM } from "@view-models/admin.game.vm";

const router = Router();

// 查詢遊戲紀錄
router.get('/history', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const param = new PageQuery<AdminMemberGameHistoryParameterVM>(req.listQuery, {
            memberId: req.query.mi ? req.query.mi : ""
        })
        res.result = await adminGameSvc.getGameHistory(param);
    } catch (error) {
        res.appError = error;
    }


    next();
})

export default router;