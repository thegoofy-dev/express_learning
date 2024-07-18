import express from 'express'; // || const express = require('express');
import mainRouter from "./routes/index.mjs"
import "./strategies/local-strategy.mjs"
import session from 'express-session';


const app = express();


const PORT = process.env.PORT || 3000;

// automatically parses JSON bodies
app.use(express.json());

// Session middleware configuration
app.use(session({
    secret: 'goofy amigo',
    saveUninitialized : false,
    resave : false,
    cookie: {
        maxAge: 60000 * 60,
    }
}));

// MOUNT means attaching something
// Mount routes to handle routes starting from the root level of app.
app.use(mainRouter); 


app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})

