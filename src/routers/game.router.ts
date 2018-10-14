import { Router } from "express";

const router = Router();

// 取得遊戲項目
router.get('/', async (req, res, next) => {
    next();
});

// 取得問與答
router.get('/question', async (req, res, next) => {
    next();
})

// 取得遊戲道具資訊
router.get('/item', async (req, res, next) => {
    next();
})

// 取得單一道具資訊
router.get('/item/:id', async (req, res, next) => {
    next();
})

// 購買道具
router.post('/item/:id', async (req, res, next) => {
    next();
})

// 開始遊戲
router.post('/:id', async () => { 

})

// 回報遊戲
router.put('/:id', async () => { 

})


export default router;