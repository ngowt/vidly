const request = require('supertest');
const mongoose = require('mongoose');
const Customer = require('../../../models/customer');
const User = require('../../../models/user');

describe('/api/customers', () => {
    beforeEach( () => { server = require('../../../index'); });
    afterEach( async () => { 
        server.close();
        await Customer.remove({});
    });
    
    describe('GET /', () => {
        const exec = async () => {
            const res = await request(server).get(`/api/customers/`)
            return res;
        };

        it('should return 200 with all customers', async () => {
            const customers = [{
                name: 'John Smith',
                isGold: false, 
                phone: '9051234567'
            },
            {
                name: 'Jane Doe', 
                isGold: true,
                phone: '6479876543'
            }];
            await Customer.collection.insertMany(customers);
            const res = await exec();
            expect(res.status).toBe(200);
        });

        it('should return customers with name, isGold, and phone properties', async () => {
            const customers = [{
                name: 'John Smith',
                isGold: false, 
                phone: '9051234567'
            },
            {
                name: 'Jane Doe', 
                isGold: true,
                phone: '6479876543'
            }];
            await Customer.collection.insertMany(customers);
            const res = await exec();
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('isGold');
            expect(res.body[0]).toHaveProperty('phone');
            expect(res.body[1]).toHaveProperty('name');
            expect(res.body[1]).toHaveProperty('isGold');
            expect(res.body[1]).toHaveProperty('phone');
        });
    });

    describe('GET /:id', () => {
        let id;

        const exec = async () => {
            const res = await request(server).get(`/api/customers/${id}`)
            return res;
        };

        it('should return the customer with the specified id', async () => {
            const customer = {
                name: 'John Smith',
                isGold: false, 
                phone: '9051234567'
            };
            await Customer.collection.insert(customer);
            id = customer._id;
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', customer._id.toHexString());
            expect(res.body).toHaveProperty('name', customer.name);
            expect(res.body).toHaveProperty('phone', customer.phone);
        });

        it('should return the 404 with no matching customer id', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });
    });
    
    describe('DELETE /', () => {
        let token;
        let id;

        const exec = async () => {
            const res = await request(server)
                .delete(`/api/customers/${id}`)
                .set('x-auth-token', token)
            return res;
        };

        it('should return 200 when deleting a customer that exists', async () => {
            const customer = new Customer({
                name: 'John Smith',
                isGold: false, 
                phone: '9051234567'
            });
            const user = {
                isAdmin: true
            };
            token = new User(user).generateAuthToken();
            id = customer._id;
            await Customer.collection.insert(customer);
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', customer._id.toHexString());
            expect(res.body).toHaveProperty('name', customer.name);
            expect(res.body).toHaveProperty('isGold', customer.isGold);
            expect(res.body).toHaveProperty('phone', customer.phone);
        });

        it('should return 404 when deleting a customer that does not exist', async () => {
            objectId = mongoose.Types.ObjectId();
            const user = {
                isAdmin: true
            };
            token = new User(user).generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(404);
        });
    });

    /*
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
    */
});