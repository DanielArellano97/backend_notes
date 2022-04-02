const mongoose = require('mongoose');
const {server} = require('../index');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { api, getUser } = require('./helpers');

describe('creatin a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('pswd', 10);
        const user = new User({ username: 'daniroot', passwordHash });

        await user.save();
    });

    test('works as expected creating a fresh username', async () => {
        const userAtStart = await getUser();

        const newUser = {
            username: 'dani',
            name: 'Daniel',
            password: 'dani1234'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const userAtEnd = await getUser();

        expect(userAtEnd).toHaveLength(userAtStart.length+1);

        const usernames = userAtEnd.map(user => user.username);
        expect(usernames).toContain(newUser.username);

    });

    afterAll(() => {
        mongoose.connection.close();
        server.close();
    });
});

