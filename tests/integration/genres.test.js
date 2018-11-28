const request = require('supertest');
const {Genre} = require('../../models/genre');
const User = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/genres', () => {
    beforeEach( () => { server = require('../../index'); });
    afterEach( async () => { 
        server.close();
        await Genre.remove({});
    });
    
    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {name: 'horror'},
                {name: 'fiction'}
            ]);
            const res = await request(server).get('/api/genres/')
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'horror')).toBeTruthy();
            expect(res.body.some(g => g.name === 'fiction')).toBeTruthy();
        });
    })

    describe('GET /:id', () => {
        it('should return the genre with the specified id', async () => {
            const genre = new Genre({ name: "horror"});
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ name: genre.name});
        });

        it('should throw a 400 error with an invalid objectid', async () => {
            const res = await request(server).get(`/api/genres/1111`);
            expect(res.status).toBe(400);
        });

        it('should throw a 404 error if no genre with the given id is found', async () => {
            const objectId = mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/genres/${objectId}`);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        beforeEach( () => {
            token = new User().generateAuthToken();
            genreName = 'fiction';
        });

        // Define the happy path, and then in each test, we change 
        // one parameter that clearly aligns with the name of the test
        
        let token;
        let genreName;

        const exec = async () => {
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: genreName });
            return res;
        };
        
        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is < 3 characters', async () => {
            genreName = 'aa';
            const res = await exec();
            expect (res.status).toBe(400);
        });

        it('should return 400 if genre is > 20 characters', async () => {
            genreName = new Array(22).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if valid', async () => {
            genreName = 'fiction'
            const res = await exec();
            const genre = Genre.find({ name: genreName});
            expect(genre).not.toBeNull();
            expect(res.status).toBe(200);
        });

        it('should return the genre if valid', async () => {
            genreName = 'fiction';
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', genreName);
        });
    })
});