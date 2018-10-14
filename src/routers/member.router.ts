import { Router } from "express";

const router = Router();

// 取得會員資料
router.get('/', async (req, res, next) => {
    next();
});

// 修改暱稱
router.put('/nick-name', async (req, res, next) => {
    next();
})


export default router;