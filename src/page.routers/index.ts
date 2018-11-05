import { Router } from "express";
import ShotGameRouter from "./shot-game.router";
import CatchGameRouter from "./catch-game.router";
import QuestionRouter from "./question.router";
import ProfileRouter from "./profile.router";
import ShopRouter from "./shop.router";

const router = Router();

router.get('/', async (req, res, next) => {
    res.render('pages/index', {
        layout: 'layouts/index',
        item: 'testItem'
    })
});

router.use('/shot-game', ShotGameRouter);
router.use('/catch-game', CatchGameRouter);
router.use('/question', QuestionRouter);
router.use('/profile', ProfileRouter);
router.use('/shop', ShopRouter);

export default router;