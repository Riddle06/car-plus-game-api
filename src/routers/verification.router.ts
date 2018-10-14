import { Router } from "express";

const router = Router();

// 登入
router.post('/login', async (req, res, next) => {
    next();
});


// 登出
router.post('/logout', async (req, res, next) => {
    next();
});

export default router;