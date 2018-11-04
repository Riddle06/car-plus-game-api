import { ReportPlayGameParameterVM } from '@view-models/game-history.vm';
import { gameSvc } from '@services';
import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { AppError } from "@view-models/common.vm";

const router = Router();


// 取得遊戲
router.get('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})



// 開始遊戲
router.post('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        const { memberToken } = req
        const param = req.body;
        res.result = await gameSvc.startGame(memberToken, param);
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})

// 回報遊戲
router.put('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {

        const { memberToken } = req
        const param: ReportPlayGameParameterVM = req.body
        param.gameHistoryId = req.params.id
        res.result = await gameSvc.reportGame(memberToken, param)
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})



export default router;