const request = require('supertest');
const {Genre} = require('../../models/genre');

describe('/api/genres', () => {
    beforeEach( () => { server = require('../../index'); });
    afterEach(async () => { 
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
    })
});