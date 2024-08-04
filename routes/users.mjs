import { Router } from "express"; 
import { filterValidationSchema, idValidationSchema,createUserValidationSchema } from "../utils/validationSchema.mjs";
import { resolveIndexByUserId} from "../utils/middleWares.mjs";
import { validationResult, matchedData,checkSchema } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs" 
import { hashPassword } from "../utils/helpers.mjs";
import { getUserByIdHandler } from "../handler/user.mjs";

const router = Router();

router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).send(users);
    } catch (err) {
        return res.status(500).send({ message: 'Internal Server Error' });
    }
});

// GET METHOD FOR QUERY & PARAMS
router.get('/api/users',
    checkSchema(filterValidationSchema),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({ errors: errors.array() });

        const { query: { filter, value } } = req;

        try {
            let users;
            if (filter && value) {
                users = await User.find({ [filter]: { $regex: value, $options: 'i' } });
            } else {
                users = await User.find();
            }
            return res.status(200).send(users);
        } catch (err) {
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    }
);

// GET METHOD FOR PARTICULAR USER DETAIL
router.get('/api/users/:id',
    checkSchema(idValidationSchema),
    getUserByIdHandler
);

// POST METHOD TECHNIQUE 2
router.post('/api/users',
    checkSchema(createUserValidationSchema),
    async (req, res) => {
        const error = validationResult(req);
        if(!error.isEmpty()) return res.send(error.array());
        
        const data = matchedData(req);
        data.password = hashPassword(data.password);
        console.log(data);
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
    resolveIndexByUserId,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({ errors: errors.array() });

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedUser) return res.status(404).send({ message: 'User Not Found' });
            return res.status(200).send(updatedUser);
        } catch (err) {
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    }
);

// PATCH METHOD -> It can update specific part of the entire data
router.patch('/api/users/:id',
    checkSchema(idValidationSchema),
    resolveIndexByUserId,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({ errors: errors.array() });

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedUser) return res.status(404).send({ message: 'User Not Found' });
            return res.status(200).send(updatedUser);
        } catch (err) {
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    }
);

// DELETE METHOD
router.delete('/api/users/:id',
    checkSchema(idValidationSchema),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send({ errors: errors.array() });

        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) return res.status(404).send({ message: 'User Not Found' });
            return res.status(200).send({ message: 'User Deleted Successfully' });
        } catch (err) {
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    }
);
export default router; 