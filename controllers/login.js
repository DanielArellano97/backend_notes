const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/User');


loginRouter.post('/', async(req, res) => {
    const {body} = req;
    const {username, password} = body;

    const user = await User.findOne({username});

    const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

    if(!(user && passwordCorrect)){
        return res.status(401).json({
            error: 'invalid user or password'
        });
    }

    const userForToker = {
        id: user._id,
        username: user.name
    }

    const token = jwt.sign(userForToker, process.env.SECRET);

    return res.send({
        name: user.name,
        username: user.username,
        token
    });
});

module.exports = loginRouter;