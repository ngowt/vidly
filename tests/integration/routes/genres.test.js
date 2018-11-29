const request = require('supertest');
const {Genre} = require('../../../models/genre');
const User = require('../../../models/user');
const mongoose = require('mongoose');

describe('/api/genres', () => {
    beforeEach( () => { server = require('../../../index'); });
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
    });

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

    describe('PUT /:id', () => {
        beforeEach( () => { 
            token = new User().generateAuthToken();
            newGenreName = 'romance';
        });

        let token;
        let objectId;
        let newGenreName;

        const exec = async () => {
            const res = await request(server)
                .put(`/api/genres/${objectId}`)
                .set('x-auth-token', token)
                .send({ name: newGenreName });
            return res;
        };

        it('should return 200 when updating a genre', async () => {
            const genre = new Genre({
                _id: mongoose.Types.ObjectId(),
                name: 'horror'
            });     
            objectId = genre._id;
            await Genre.collection.insert(genre);
            const res = await exec();
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', newGenreName);
        });

        it('should return 404 when updating a nonexistent genre', async () => {
            objectId = mongoose.Types.ObjectId();
            const res = await exec();
            
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

        it('should return 400 if genre already exists', async () => {
            const genre = new Genre({
                name: 'horror'
            });
            token = new User().generateAuthToken();
            await Genre.collection.insert(genre);
            genreName = genre.name;
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
    });

    describe('DELETE /', () => {
        let token;
        let objectId;

        const exec = async () => {
            const res = await request(server)
                .delete(`/api/genres/${objectId}`)
                .set('x-auth-token', token)
            return res;
        };

        it('should return 200 when deleting a genre that exists', async () => {
            const genre = new Genre({
                _id: mongoose.Types.ObjectId(),
                name: 'horror'
            });
            const user = {
                isAdmin: true
            };
            token = new User(user).generateAuthToken();
            objectId = genre._id;
            await Genre.collection.insert(genre);
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 when deleting a genre that does not exist', async () => {
            objectId = mongoose.Types.ObjectId();
            const user = {
                isAdmin: true
            };
            token = new User(user).generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(404);
        });
    });
});