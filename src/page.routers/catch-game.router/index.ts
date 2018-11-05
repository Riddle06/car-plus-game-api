import { Router } from "express";

const router = Router();

router.get('/', async (req, res, next) => {
    res.render('pages/game-intro', {
        layout: 'layouts/index'
    })
});

router.get('/:id', async (req, res, next) => {
    res.render('pages/catch-game', {
        layout: 'layouts/index'
    })
})

export default router;