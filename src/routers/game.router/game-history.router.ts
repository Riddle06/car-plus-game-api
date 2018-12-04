import { ReportPlayGameParameterVM } from '@view-models/game-history.vm';
import { gameSvc } from '@services';
import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { AppError } from "@view-models/common.vm";

const router = Router();



/**
 * [GET] /api/game/history/:id
 * 取得該筆遊戲資料，用在結算頁面
 * @param {String} id id 為 會員遊玩的該筆的紀錄
 */
router.get('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = await gameSvc.memberGetGameHistory(req.memberToken, req.params.id)
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})



/**
 * [POST] /api/game/history
 * 新增一筆遊戲
 * @returns {String} id ，回傳 id 為 會員遊玩的該筆的紀錄
 */
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

/**
 * [PUT] /api/game/history/:id
 * 回報遊戲分數
 * @param {String} id id 為 會員遊玩的該筆的紀錄
 */
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