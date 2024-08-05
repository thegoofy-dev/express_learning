import express from 'express'; // || const express = require('express');
import mainRouter from "./routes/index.mjs"
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import "./strategies/local-strategy.mjs"
import "./strategies/discord-strategy.mjs"


export function createApp() {


    const app = express() ;
    // automatically parses JSON bodies
    app.use(express.json());

    // Session middleware configuration
    app.use(session({
        secret: 'goofy amigo',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
    }));

    // MOUNT means attaching something
    // Mount routes to handle routes starting from the root level of app.
    app.use(mainRouter);

    return app;
}