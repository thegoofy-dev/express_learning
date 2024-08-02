import express, { request } from 'express'; // || const express = require('express');
import mainRouter from "./routes/index.mjs"
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
// import "./strategies/local-strategy.mjs"
import "./strategies/discord-strategy.mjs"

const app = express();

mongoose.connect('mongodb://localhost:27017/express_tutorial')
    .then(() => console.log('MongoDB connected to Database'))
    .catch((err) => console.log(`Error : ${err}`));

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
    },
    store:MongoStore.create({
        client: mongoose.connection.getClient(),
    }),
}));

// MOUNT means attaching something
// Mount routes to handle routes starting from the root level of app.
app.use(mainRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})