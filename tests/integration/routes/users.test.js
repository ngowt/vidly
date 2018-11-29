const User = require('../../../models/user');
const bcrypt = require('bcryptjs');
const request = require('supertest');


describe('/api/users', () => {
    beforeEach( () => { server = require('../../../index'); });
    afterEach( async () => { 
        server.close();
        await User.remove({});
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