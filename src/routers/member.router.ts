import { Router } from "express";
import { RequestExtension } from "view-models/extension";

const router = Router();

// 取得會員資料
router.get('/', async (req: RequestExtension, res, next) => {
    next();
});

// 修改暱稱
router.put('/nick-name', async (req: RequestExtension, res, next) => {
    next();
})


export default router;