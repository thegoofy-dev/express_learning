import { Router } from "express"; 
import { filterValidationSchema, idValidationSchema,createUserValidationSchema } from "../utils/validationSchema.mjs";
import { animeCharac } from "../utils/constants.mjs";
import { resolveIndexByUserId} from "../utils/middleWares.mjs";
import { validationResult, matchedData,checkSchema } from "express-validator";
import session from "express-session";
import { User } from "../mongoose/schemas/user.mjs" 

const router = Router();

// app.use(loggingMiddleware); // Automatically used inside all methods(GET, PUT, PATCH, POST, DELETE, etc.)

// Applied MiddleWare function inside the GET method expilcitly
// router.get('/', loggingMiddleware, (req, res, next) => {
//     console.log(`MiddleWare 2 Used --> ${req.hostname}`);
//     next();
//     },
//     (req, res) => {
//         res.status(200).send("HOLA!!!");
//     }
// );


// GET METHOD FOR QUERY & PARAMS
router.get('/api/users',
    checkSchema(filterValidationSchema),
    (req, res) => {
        // console.log(req.session);
        console.log(req.session.id);
        req.sessionStore.get(req.session.id, (errors, sessionData) => {
            if(errors) {
                console.log(errors);
                throw errors;
            }
            console.log("Session Data : ",sessionData);
        });

        // console.log(req);
        const errors = validationResult(req);
        // console.log(result);

        if(!errors.isEmpty())
            return res.status(400).send({errors : errors.array()})
        const { query: { filter, value } } = req;

        // When filter and values are undefined
        if (!filter && !value)
            return res.send(animeCharac);
        if (filter && value) {
            const filteredUsers = animeCharac.filter((user) => user[filter].includes(value));
            return res.send(filteredUsers);
        }
        res.send(animeCharac);
    }
);

// GET METHOD FOR PARTICULAR USER DETAIL
router.get('/api/users/:id',
    checkSchema(idValidationSchema),
    resolveIndexByUserId, (req, res) => {
        // console.log(req.params);

        const { findUserIndex } = req;  // Getting user's index from req
        const data = matchedData(validationResult(req));
        const user = animeCharac[findUserIndex]; //Getting user info

        // checking user present or not
        if (!data)
            return res.status(404).send({ msg: 'User Not found' });
        return res.status(200).send(user);
    }
);

// POST METHOD TECHNIQUE 1
// router.post('/api/users', (req, res) => {
//     // console.log(req.body);
//     const newUser = {
//         id: animeCharac.length+1,
//         username: req.body.username,
//         displayName: req.body.displayName,
//     }
//     // console.log(newUser.id)
//     // console.log(newUser.username)
//     // console.log(newUser.displayName)

//     // Checking for both displayName and userName
//     if(!newUser.displayName && !newUser.username)
//         return res.status(400).send({Message : 'Please provide username and displayName both!'});
//     animeCharac.push(newUser);
//     res.sendStatus(204);
// })

// POST METHOD TECHNIQUE 2
router.post('/api/users',
    checkSchema(createUserValidationSchema),
    async (req, res) => {
        const error = validationResult(req);
        if(!error.isEmpty()) return res.send(error.array());
        
        const data = matchedData(req);
        const newUser = new User(data);
        try {
            const savedUser = await newUser.save();
            return res.status(201).send(savedUser);
        }
        catch (err) {
            console.log(err);
            return res.sendStatus(400);
        }
    }
);


// PUT METHOD -> It can update entire data
router.put('/api/users/:id',
    checkSchema(idValidationSchema),
    resolveIndexByUserId, (req, res) => {

        const { findUserIndex, body } = req;

        // const result = validationResult(req); // Checks if there is any error present or not
        // console.log(result);

        // Update the user if found
        animeCharac[findUserIndex] = { id: animeCharac[findUserIndex].id, ...body }
        console.log('Updated user:', animeCharac[findUserIndex]);

        return res.status(200).send(animeCharac);
    }
);

// PATCH METHOD -> It can update specific part of the entire data
router.patch("/api/users/:id",
    checkSchema(idValidationSchema),
    resolveIndexByUserId,
    (req, res) => {
        const { findUserIndex, body } = req;

        // console.log(req.params);

        // Update the user if found
        animeCharac[findUserIndex] = { ...animeCharac[findUserIndex], ...body };

        return res.status(200).send(animeCharac);
    }
);

// DELETE METHOD
router.delete('/api/users/:id',
    checkSchema(idValidationSchema),
    resolveIndexByUserId, (req, res) => {
        const { findUserIndex } = req;

        animeCharac.splice(findUserIndex, 1);  //Removing the user

        return res.status(200).send(animeCharac);
    }
);

export default router; 