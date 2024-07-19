import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../mongoose/schemas/user.mjs';

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
    async (username, password, done) => {
        console.log(`USERNAME: ${username}`);
        console.log(`PASSWORD: ${password}`);
        try {
            const findUser = await User.findOne({ username });
            if (!findUser) {
                return done(null, false, { message: 'User not found' });
            }
            if (findUser.password !== password) {
                return done(null, false, { message: 'Invalid credentials' });
            }
            return done(null, findUser);
        } catch (err) {
            return done(err);
        }
    }
));

export default passport;
