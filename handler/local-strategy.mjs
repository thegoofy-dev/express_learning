import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

export const localStrategyHandler = async (username, password, done) => {
    console.log(`USERNAME: ${username}`);
    console.log(`PASSWORD: ${password}`);
    try {
        const findUser = await User.findOne({ username });
        if (!findUser) {
            return done(null, false, { message: 'User not found' });
        }
        if (!comparePassword(password, findUser.password)) {
            return done(null, false, { message: 'Invalid credentials' });
        }
        return done(null, findUser);
    } catch (err) {
        return done(err);
    }
} 