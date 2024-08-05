import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../mongoose/schemas/user.mjs';
import { localStrategyHandler } from '../handler/local-strategy.mjs';

passport.serializeUser((user, done) => {
    console.log('Inside Serialize User');
    console.log(user);
    done(null, user.id); // Ensure only the ID is stored
});

passport.deserializeUser(async (id, done) => {
    console.log('Inside Deserialize User');
    console.log(`Deserializing User ID: ${id}`);
    try {
        const findUser = await User.findById(id); // Find user by ID
        if (!findUser) {
            throw new Error('User Not Found');
        }
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new LocalStrategy(
    { usernameField: 'username' }, // Use 'email' if using email as username
    localStrategyHandler
));

export default passport;
