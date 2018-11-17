import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";

const router = Router();

// 查詢遊戲紀錄
router.get('/history', async (req: RequestExtension, res: ResponseExtension, next) => {
    //TODO:
    next();
})

export default router;