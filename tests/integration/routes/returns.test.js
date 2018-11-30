const Rental = require('../../../models/rental');
const request = require('supertest');
const mongoose = require('mongoose');


describe('/api/returns', () => {
    beforeEach( () => { 
        server = require('../../../index');
    });
    afterEach( async () => { 
        server.close();
        await Rental.remove({});
    });

    describe('POST /', () => {
        it('should return the rental after passing a valid customerid and movieid', async () => {
            const rental = new Rental({
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
            const res = await Rental.findById(rental._id);       
            expect(res).not.toBeNull();
        });
    });
});