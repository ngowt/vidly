const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../../../models/user');
const Rental = require('../../../models/rental');

describe('/api/returns', () => {
    beforeEach( () => { 
        server = require('../../../index');
    });
    afterEach( async () => { 
        await Rental.remove({});
        await server.close();
    });

    describe('POST /', () => {
        beforeEach( async () => {
            rental = new Rental({
                customer: {
                    _id: mongoose.Types.ObjectId(),
                    name: "John Smith",
                    phone: "9051234567"
                },
                movie: {
                    _id: mongoose.Types.ObjectId(),
                    title: "Movie title",
                    genre: {
                        name: "Genre name"
                    },
                    numberInStock: 2,
                    dailyRentalValue: 5
                }
            });
            await rental.save();
            customerId = rental.customer._id;
            movieId = rental.movie._id;
        });

        let rental;
        let customerId;
        let movieId;
        
        const exec = async() => {
            const res = request(server).post(`/api/returns/`)
                .set('x-auth-token', new User().generateAuthToken())
                .send({ 
                    customerId: customerId, 
                    movieId: movieId
                });
            return res;
        }

        it('should return the rental after passing a valid customerid and movieid', async () => {
            const res = await Rental.findById(rental._id);       
            expect(res).not.toBeNull();
        });

        it('should set the returnDate if input is valid', async () => {
            customerId = rental.customer._id;
            movieId = rental.movie._id;
            const res = await exec();
            const rentalInDb = await Rental.findById(rental._id);
            const diff = new Date() - rentalInDb.dateReturned;
            expect(diff).toBeLessThan(10 * 1000);
        });

        it('should set the rental fee if input is valid', async () => {
            rental = new Rental({
                customer: {
                    _id: mongoose.Types.ObjectId(),
                    name: "John Smith",
                    phone: "9051234567"
                },
                movie: {
                    _id: mongoose.Types.ObjectId(),
                    title: "Movie title",
                    genre: {
                        name: "Genre name"
                    },
                    numberInStock: 2,
                    dailyRentalValue: 2
                }
            });
            customerId = rental.customer._id;
            movieId = rental.movie._id;
            let todaysDate = new Date();
            rental.dateOut = new Date();
            rental.dateOut.setDate(rental.dateOut.getDate() - 7);
            await rental.save();
            const res = await exec();
            expect(res.body.rentalFee).toBe(14);
        });

        it('should return 200 if valid customerId and movieId passed', async () => {
            customerId = rental.customer._id;
            movieId = rental.movie._id;
            const res = await exec();
            expect(res.status).toBe(200);
        });

        it('should return 400 if customerid is not passed', async () => {
            customerId = '';
            movieId = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if movieId is not passed', async () => {
            customerId = '1234';
            movieId = '';
            const res = await exec(); 
            expect(res.status).toBe(400);
        });

        it('should return 400 if return is already processed', async () => {
            rental = new Rental({
                customer: {
                    _id: mongoose.Types.ObjectId(),
                    name: "John Smith",
                    phone: "9051234567"
                },
                movie: {
                    _id: mongoose.Types.ObjectId(),
                    title: "Movie title 2",
                    genre: {
                        name: "Genre name"
                    },
                    numberInStock: 2,
                    dailyRentalValue: 5
                },
                dateReturned: Date.now(),
                rentalFee: 1.23,
            });
            await rental.save();
            customerId = rental.customer._id;
            movieId = rental.movie._id;
            const res = await exec(); 
            expect(res.status).toBe(400);
        });

        it('should return 404 if customer and rental does not exist', async () => {
            customerId = new mongoose.Types.ObjectId();
            movieId = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

    });
});