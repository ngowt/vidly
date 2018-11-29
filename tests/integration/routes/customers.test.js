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
        let customers;
        beforeEach( async () => {
            customers = [{
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
        });
        
        const exec = async () => {
            const res = await request(server).get(`/api/customers/`)
            return res;
        };

        it('should return 200 with all customers', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
        });

        it('should return customers with name, isGold, and phone properties', async () => {
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
    
    describe('POST /', () => {
        beforeEach( () => {
            name = 'John Smith';
            isGold = false,
            phone = '9051234567';
        });

        let name;
        let isGold;
        let phone;

        const exec = async () => {
            const res = await request(server)
                .post('/api/customers')
                .send({ 
                    name: name,
                    isGold: isGold,
                    phone: phone
                });
            return res;
        };

        it('should return 200 when inserting a customer', async () => {  
            const res = await exec();
            expect(res.status).toBe(200);
        });

        it('should return the new customer', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('name', name);
            expect(res.body).toHaveProperty('isGold', isGold);
            expect(res.body).toHaveProperty('phone', phone);
        });

        it('should save the customer if valid', async () => {
            await exec();
            const customer = Customer.find({ name: name});
            expect(customer).not.toBeNull();
        });
    }); 

    describe('PUT /:id', () => {
        beforeEach( () => { 
            const user = {
                isAdmin: true
            };
            name = 'Joseph Smith';
            isGold = true;
            phone = '1234567890';
            token = new User(user).generateAuthToken();
        });

        let name;
        let isGold;
        let phone;
        let token;

        const exec = async () => {
            const res = await request(server)
                .put(`/api/customers/${id}`)
                .set('x-auth-token', token)
                .send({ 
                    name: name,
                    isGold: isGold,
                    phone: phone 
                });
            return res;
        };

        it('should return 200 when updating a customer', async () => {
            const customer = {
                name: 'John Smith',
                isGold: false, 
                phone: '9051234567'
            };
            
            await Customer.collection.insert(customer);
            id = customer._id;
            const res = await exec();
            expect(res.status).toBe(200);
        });

        it('should update the properties of the customer', async () => {
            const customer = {
                name: 'John Smith',
                isGold: false, 
                phone: '9051234567'
            };
            await Customer.collection.insert(customer);
            id = customer._id;
            const res = await exec();
            expect(res.body).toHaveProperty('name', name);
            expect(res.body).toHaveProperty('isGold', isGold);
            expect(res.body).toHaveProperty('phone', phone);
        });

        it('should return 404 when updating a nonexistent customer', async () => {
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
});