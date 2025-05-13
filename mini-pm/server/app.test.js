const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');
const Users = require('./models/userSchema');


describe('Registration Endpoint', () => {
    beforeAll(async () => {
        // Connect to a test database
        await mongoose.connect('mongodb+srv://youssefhelal2002:fenkyn-Xifdow-3tonqi@cluster0.emod9mu.mongodb.net/FreelanceFlex?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        // Clean up test database
        await Users.deleteMany({});
        await mongoose.connection.close();
    });

    test('It should register a new user successfully', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'freelancer'
            });
        expect(response.statusCode).toBe(200);
        expect(response.text).toEqual('Registered successfully');
    });

    test('It should not register a user with an existing email', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser2',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'client'
            });
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual('Already used Details');
    });

    test('It should not register a user with an invalid role', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser3',
                email: 'testuser3@example.com',
                password: 'password123',
                role: 'invalid_role'
            });
        expect(response.statusCode).toBe(400);
        expect(response.text).toEqual('Invalid role specified');
    });
});
describe('Login Endpoint', () => {
    test('It should not log in with incorrect password', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongPassword'
            });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });

    test('It should not log in a non-existent user', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'nonexistentUser@example.com',
                password: 'password123'
            });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({});
    });
});