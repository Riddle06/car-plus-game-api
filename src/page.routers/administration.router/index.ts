import { Router } from "express";

const router = Router();

router.get('/', async (req, res, next) => {
    res.render('pages/admin/index', {
        layout: 'layouts/admin.layout.hbs',
    })
});

router.get('/:id', async (req, res, next) => {
    res.render('pages/admin/login', {
        layout: 'layouts/admin.layout.hbs'
    })
})

export default router;