import passport from "passport";
import { Strategy } from "passport-local";
import { animeCharac } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
    console.log('Inside Serialize User');
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('Inside Deserialize User');
    console.log(`Deserializing User ID: ${id}`);
    try {
        const findUser = animeCharac.find((user) => user.id === id);
        if(!findUser)
            throw new Error('User Not Found');
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
})

export default passport.use(
    new Strategy((username, password, done) => {     // new Strategy({ usernameField: "email" }, (email, password, done) => {
        console.log(`USERNAME : ${username}`)
        console.log(`PASSWORD : ${password}`)
        try { 
            const findUser = animeCharac.find((user) => user.username === username);
            if(!findUser) 
                throw new Error("User not found");
            if (findUser.password !== password)
                throw new Error("Invalid  Credentials");
            done(null, findUser);
        }
        catch (err) {
            done(null, null);     
        }
    })
);