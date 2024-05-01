import request from 'supertest';
import app from '../../server.js';
import mongoose from 'mongoose';
import { user } from '../models/userModel.js';
import { beforeEach } from 'node:test';
describe('User Controller', () => {
    beforeAll(async () => {
        await user.deleteMany();
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });
    it('should create a new user', async () => {
        // Test logic for creating a new user
        const res = await request(app)
            .post('/api/users/register')
            .send({ username: 'userfortest1', email: 'userfortest1@example.com', password: 'password' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should update a user profile', async () => {
        // Create a new user
        const newUser = { username: 'userfortest2', email: 'userfortest2@example.com', password: 'password' };
        const registerResponse = await request(app)
            .post('/api/users/register')
            .send(newUser);
        const token = registerResponse.body.token;
        

        // Update the user profile
        const updatedUserInfo = { username: 'updateduser', email: 'updated@example.com', password: 'newpassword' };
        const updateResponse = await request(app)
            .put('/api/users/update')
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUserInfo);

        // Check if the update was successful
        expect(updateResponse.statusCode).toEqual(200);
        expect(updateResponse.body).toHaveProperty('message', 'User updated successfully');

        // Fetch the updated user profile
        const userProfileResponse = await request(app)
            .get('/api/users/user')
            .set('Authorization', `Bearer ${token}`);

        console.log(userProfileResponse);
        // Check if the updated user profile matches the expected values
        expect(userProfileResponse.statusCode).toEqual(200);
        expect(userProfileResponse.body.username).toEqual('updateduser');
        expect(userProfileResponse.body.email).toEqual('updated@example.com');
    });


    it('should read user profile', async () => {
        const newUser = { username: 'userfortest3', email: 'userfortest3@example.com', password: 'password' };
        const registerResponse = await request(app)
            .post('/api/users/register')
            .send(newUser);
        const token = registerResponse.body.token;
        const page = 1;
        const limit = 10;
        const sort = 'username';
        const sortOrder = 'asc';

        const profileResponse = await request(app)
            .get('/api/users/profile')
            .query({ page, limit, sort, sortOrder })
            .set('Authorization', `Bearer ${token}`);
        expect(profileResponse.statusCode).toEqual(200);
        expect(profileResponse.body).toBeInstanceOf(Array);
    });

    it('should delete a user', async () => {
        // Test logic for deleting a user
        const newUser = { username: 'userfortest4', email: 'userfortest4@example.com', password: 'password' };
        const registerResponse = await request(app)
            .post('/api/users/register')
            .send(newUser);
        const token = registerResponse.body.token;
        const res = await request(app)
            .delete('/api/users/delete')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User deleted successfully');

        // Check if user profile is deleted
        const deletedUser = await request(app)
            .get('/api/users/user')
            .set('Authorization', `Bearer ${token}`);

        expect(deletedUser.status).toEqual(200);
        expect(deletedUser.body).toBeNull();
    });
});

