import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";
import authenticationRouter from "../routes/passport_authentication.mjs";

let app;

beforeAll(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/express_tutorial_test');
        console.log('MongoDB connected to Test Database');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err;
    }

    app = createApp();
    app.use(authenticationRouter);
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (err) {
        console.error('Failed to close MongoDB connection', err);
        throw err;
    }
});


describe('api/auth', () => {
    it('should return 401 when not logged in', async () => {
        const res = await request(app).get("/api/auth/status");
        expect(res.statusCode).toBe(401);
    });
});
