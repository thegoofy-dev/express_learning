import { User } from "../mongoose/schemas/user.mjs";

// MIDDLEWARE
export const loggingMiddleware = (req, res, next) => {
    console.log(`MiddleWare 1 Used --> Method: ${req.method}, URL: ${req.url}`);
    next();
}

// MIDDLEWARE FOR USER's INDEX AND ID
export const resolveIndexByUserId = async (req, res, next) => {
    const { params: { id } } = req;

    // Validate if the ID is a valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ message: 'Invalid ID format' });
    }

    try {
        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ message: 'User Not Found' });
        }

        // Attach the user object to the request object
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};


