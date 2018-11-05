import { Router } from "express";

const router = Router();

router.get('/', async (req, res, next) => {
    res.render('pages/shop', {
        layout: 'layouts/index'
    })
})


export default router;


