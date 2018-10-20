import { Router } from "express";
import GameRouter from "./game.router";
import MemberRouter from "./member.router";
import VerificationRouter from "./verification.router";
import TestRouter from "./test.router";

const router = Router();

router.use('/game', GameRouter);
router.use('/member', MemberRouter);
router.use('/verification', VerificationRouter)
router.use('/test', TestRouter)

export default router;