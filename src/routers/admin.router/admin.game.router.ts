import { PageQuery } from './../../view-models/common.vm';
import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { adminGameSvc } from '@services/admin.game.svc';
import { gameSvc } from '@services';

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


// 取得遊戲列表
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const ret = await adminGameSvc.getGameList()
        res.result = ret;
    } catch (error) {
        res.appError = error;
    }

    next();
})



// 更新遊戲參數
router.put('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const id = req.params.id;
        if (['dashboard', 'car-plus-point/enable'].includes(id)) {
            next();
            return;
        }
        const ret = await adminGameSvc.updateGame(id, req.body)
        res.result = ret;
    } catch (error) {
        res.appError = error;
    }

    next();
})


/**
 * [PUT] /admin/api/game/car-plus-point/enable
 * 設定格上紅利的顯示狀態
 */
router.put('/car-plus-point/enable', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const param = req.body;
        res.result = await gameSvc.setCarPlusPointEnable(param)
    } catch (error) {
        res.appError = error
    }
    next();
})





export default router;