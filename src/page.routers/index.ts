import { Router } from "express";
import ShotGameRouter from "./shot-game.router";
import CatchGameRouter from "./catch-game.router";
import QuestionRouter from "./question.router";
import ProfileRouter from "./profile.router";
import ShopRouter from "./shop.router";
import AdministrationRouter from "./administration.router";
import { gamePageMiddleware } from '../middlewares/game-page.middleware';
import { RequestExtension, ResponseExtension } from "@view-models/extension";


const router = Router();

router.get('/', gamePageMiddleware, (req: RequestExtension, res: ResponseExtension) => {
    res.render('pages/index', {
        scale: req._scale
    })
});

router.get('/tutorial', (req: RequestExtension, res: ResponseExtension) => {
    res.render('pages/tutorial', {
        scale: 1
    })
});

router.use('/shot-game', gamePageMiddleware, ShotGameRouter);
router.use('/catch-game', gamePageMiddleware, CatchGameRouter);
router.use('/question', gamePageMiddleware, QuestionRouter);
router.use('/profile', gamePageMiddleware, ProfileRouter);
router.use('/shop', gamePageMiddleware, ShopRouter);
router.use('/administration', AdministrationRouter)

export default router;