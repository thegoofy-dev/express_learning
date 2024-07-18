import { Router } from "express";
import cookieParser from 'cookie-parser';


const router = Router();

router.use(cookieParser('Kaijuu'));

router.get("/set-normal-cookie", (req, res) => {
    res.cookie('normal', "normalValue", {maxAge: 60000, httpOnly:true});
    res.status(201).send('Normal Cookie has been set');
});

// 
router.get("/set-signed-cookie", (req, res) => {
    res.cookie('signed', "HOLA AMIGOO!!!", {signed : true,maxAge: 60000, httpOnly:true});
    res.status(201).send('Signed Cookie has been set');
});

router.get('/get-cookies', (req, res) => {
    const normalCookie = req.cookies['normal'];
    const signedCookie = req.signedCookies['signed'];
    res.send(`Normal cookie: ${normalCookie}, Signed cookie: ${signedCookie}`);
});

export default router;