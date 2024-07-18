import { Router } from "express";

const router = Router();

router.get('/api/products', (req, res) => {
    // console.log(req.headers.cookies);  
    console.log(req.cookies);  
    if(req.cookies.Anime && req.cookies.Anime === 'Wind Breaker')
        return res.status(200).send([{id:123, name:'Chicken Breast', price : 12.99}]);
    return res.status(403).send({msg: "Sorry, You need the correct cookie"})
    }
);

export default router;