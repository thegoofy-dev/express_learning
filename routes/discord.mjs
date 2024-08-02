import passport from "passport";
import "../strategies/discord-strategy.mjs"
import { Router } from "express";

const router = Router();

router.use(passport.initialize());
router.use(passport.session());

router.get('/api/auth/discord', (passport.authenticate('discord')))

router.get('/api/auth/discord/redirect', passport.authenticate("discord"), (req, res) => {
    // console.log(req.session);
    // console.log(req.user);
    res.sendStatus(200);
})

export default router;