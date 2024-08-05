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

describe('create user & login', () => {
    it('should create the user', async () => {
        const res = await request(app).post('/api/users').send({
            username: 'tester1',
            password: "passcode1",
            displayName: 'Snoop the Tester'
        });
        expect(res.statusCode).toBe(201);
    });

    it('should log the user in', async () => {
        const res = await request(app).post("/api/auth").send({
            username: 'tester1',
            password: "passcode1",
        });
        expect(res.statusCode).toBe(200);
        });
    });