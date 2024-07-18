import { Router } from "express";  
import { animeCharac } from "../utils/constants.mjs";
import session from 'express-session';

const router = Router();

// Session middleware configuration
router.use(session({
    secret: 'goofy amigo',
    saveUninitialized : false,
    resave : false,
    cookie: {
        maxAge: 60000 * 60,
    }
}));

// GET METHOD -> '/'
router.get("/", (req, res) => {
    console.log("Session : ",req.session);
    console.log("Session Id : ",req.session.id);  // ||   console.log(req.sessionID);
    res.cookie('JS', 'express', {maxAge:6000 * 60, httpOnly: true} )
    req.session.visited = true;
    res.status(200).send({msg : "HOLA AMIGOOO!!!!!"});
})

// POST Method -> '/api/auth'
router.post('/api/auth', (req, res) => {
    const { body : {username, password} } = req;
    
    const findUser = animeCharac.find((user) => user.username === username);
    if (!findUser || findUser.password !== password) 
        return res.status(401).send({msg : "BAD CREDENTIALS"});

    req.session.user = findUser;
    return res.status(200).send(findUser);
    }
);

// GET METHOD -> '/api/auth/status'
router.get("/api/auth/status", (req, res) => {
    req.sessionStore.get(req.session.id, (errors, sessionData) => {
        if(errors) {
            console.log(errors);
            throw errors;
        }
        console.log("Session Data : ",sessionData);
    });
    
    return req.session.user 
    ? res.status(200).send(req.session.user) 
    : res.status(401).send({msg : "Not Authenticated"});
    }
);

// POST Method -> '/api/cart'
router.post('/api/cart', (req, res) => {
    if(!req.session.user) 
        return res.sendStatus(401);

    const { body: item } = req;
    const { cart } = req.session;

    if(cart) 
        cart.push(item);
    else 
        req.session.cart = [item];

    return res.status(201).send(item);
    }
);

// GET Methpd -> '/api/cart'
router.get('/api/cart', (req, res) => {
    if(!req.session.user)
        return res.sendStatus(401);

    return res.send(req.session.cart ?? []);
    }
);

export default router;