const User = require('../../../models/user');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const mongoose = require('mongoose');


describe('/api/users', () => {
    beforeEach( () => { server = require('../../../index'); });
    afterEach( async () => { 
        server.close();
        await User.remove({});
    });

    describe('GET /me', () => {        
        let token;

        const exec = async () => {
            const res = await request(server)
                .get(`/api/users/me`)
                .set('x-auth-token', token)
                .send();
            return res;
        };
        
        it('should return 200 with valid JWT', async () => {
            let salt = await bcrypt.genSalt(10);
            const user = new User({
                name: 'John Smith',
                password: await bcrypt.hash('a123456#', salt),
                email: 'johnsmith@gmail.com',
                isAdmin: true
            });
            token = user.generateAuthToken();
            await User.collection.insertOne(user);
            const res = await exec();
            expect(res.status).toBe(200);
        });
        
        it('should return the user with name, email, and isAdmin properties', async () => {
            let salt = await bcrypt.genSalt(10);
            const user = new User({
                name: 'John Smith',
                password: await bcrypt.hash('a123456#', salt),
                email: 'johnsmith@gmail.com',
                isAdmin: true
            });
            token = user.generateAuthToken();
            await User.collection.insertOne(user);
            const res = await exec();
            expect(res.body).toHaveProperty('_id', user._id.toHexString());
            expect(res.body).toHaveProperty('email', user.email);
            expect(res.body).toHaveProperty('isAdmin', user.isAdmin);
        });

        it('should return the user without the password property', async () => {
            let salt = await bcrypt.genSalt(10);
            const user = new User({
                name: 'John Smith',
                password: await bcrypt.hash('a123456#', salt),
                email: 'johnsmith@gmail.com',
                isAdmin: true
            });
            token = user.generateAuthToken();
            await User.collection.insertOne(user);
            const res = await exec();
            expect(res.body).not.toHaveProperty('password');
        });

        it('should return 400 when invalid token is passed', async () => {
            token = new User().generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(400);
        });
    });

    describe('GET /', () => {
        beforeEach( async () => {
            salt = await bcrypt.genSalt(10);
            await User.collection.insertMany([{
                name: 'John Smith',
                password: await bcrypt.hash('a123456#', salt),
                email: 'johnsmith@gmail.com',
                isAdmin: true
            },
            {
                name: 'Jane Smith',
                password: await bcrypt.hash('a1234567890#', salt),
                email: 'janesmith@gmail.com',
                isAdmin: false
            }]);
        });

        let salt;

        const exec = async () => {
            const res = await request(server).get('/api/users/');
            return res;
        };

        it('should return all the users', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });

        it('should return users with name, email and isAdmin property', async () => {
            const res = await request(server).get('/api/users/');
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('email');
            expect(res.body[0]).toHaveProperty('isAdmin');
            expect(res.body[1]).toHaveProperty('name');
            expect(res.body[1]).toHaveProperty('email');
            expect(res.body[1]).toHaveProperty('isAdmin');
        });

        it('should return users without the password', async () => {
            const res = await request(server).get('/api/users/');
            expect(res.body[0]).not.toHaveProperty('password');
            expect(res.body[1]).not.toHaveProperty('password');
        });
    });
});