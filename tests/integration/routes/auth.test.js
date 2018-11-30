const auth = require('../../../routes/auth');
const request = require('supertest');
const User = require('../../../models/user');

describe('/api/auth', () => {
    beforeEach( () => { server = require('../../../index'); });
    afterEach( async () => { 
        
        await User.remove({});
        await server.close();
    });
    
    describe('POST /', () => {
        let email;
        let password;
        let req = {
            email: email,
            password: password
        };

        const exec = async () => {
            const res = await request(server)
                .post(`/api/auth/`)
                .send({
                    email: email, 
                    password: password 
                });
            return res;
        };
        /*
        it('should return 200 if correct credentials are passed', async () => {
            const testuser = {
                name: "Test User",
                password: "a123456#",
                email: "abcdefg@gmail.com",
                isAdmin: false
            };
            await User.collection.insert(testuser);
            email = testuser.email;
            password = testuser.password;
            const res = await exec();
            expect(res.status).toBe(200);
        });
        */
        it('should return 400 if email does not exist', async () => {
            email = 'abcdefg@gmail.com';
            password = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        // To continue tomorrow
        it('should return 400 if password to registered user is not provided', async () => {
            const testuser = {
                name: "Test User",
                password: "a123456#",
                email: "abcdefg@gmail.com",
                isAdmin: false
            };
            await User.collection.insert(testuser);
            email = "abcdefg@gmail.com";
            password = null;
            const res = await exec();
            expect(res.status).toBe(400);
        });
    });
})
