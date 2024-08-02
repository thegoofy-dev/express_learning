import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

passport.serializeUser((user, done) => {
    console.log('Inside Discord Serialize User');
    // console.log(user);
    done(null, user.id); // Ensure only the ID is stored
});

passport.deserializeUser(async (id, done) => {
    console.log('Inside Discord Deserialize User');
    // console.log(`Discord Deserializing User ID: ${id}`);
    try {
        const findUser = await DiscordUser.findById(id); // Find user by ID
        return findUser ? done(null, findUser) : done(null, null);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
        let findUser;
        try {
            findUser = await DiscordUser.findOne({discordId:profile.id});
        } catch (err) {
            return done(err, null);
        }
        try {
            if(!findUser) {
                const newUser =  new DiscordUser({
                    username: profile.username,
                    discordId: profile.id,
                });
                const newSavedUser = await newUser.save();
                done(null, newSavedUser);
            }
            return done(null, findUser);
        } catch (error) {
            console.log(err);
            return done(err, null);
        }
    })
);