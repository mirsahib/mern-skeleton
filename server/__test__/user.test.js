import { expect } from '@jest/globals';
import request from 'supertest'
import app from '../express'
import server from '../server'

describe("Test User CRUD", () => {
    // Add individual test cases
    it("should return 200 response and Array of User if GET request to '/api/users'", async () => {
        const res = await request(app).get('/api/users')
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });
    it("should return 200 response if POST request to '/api/user'", async () => {
        const second = new Date().getSeconds()
        const res = await request(app)
            .post('/api/users')
            .send({
                "name": "Jon Doe",
                "email": `johnDoe${second}@gmail.com`,
                "password": "123456"
            })
        expect(res.status).toBe(200);
        expect(res.body.message).toEqual("Successfully signed up!")
    })

    afterAll(async () => {
        //it better to use a seperate database for test environment
        await server.server.close();
        await server.mongoose.disconnect()
    });
});