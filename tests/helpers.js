const { app } = require('../index');
const supertest = require('supertest');
const api = supertest(app);
const User = require('../models/User');

const initialNotes = [
    {
        content: 'Aprendiendo FullStack JS con mideduv',
        important: true,
        date: new Date()
    },
    {
        content: 'Sigueme en https://midu.tube',
        important: true,
        date: new Date()
    }
];

const getAllContentFromNotes = async() => {
    const response = await api.get('/api/notes');
    return {
        contents: response.body.map(note => note.content),
        response
    }
}

const getUser = async() => {
    const usersDB = await User.find({});
    return usersDB.map(user => user.toJSON());
}

module.exports = {
    initialNotes,
    api,
    getAllContentFromNotes,
    getUser
};