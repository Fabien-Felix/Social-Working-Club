const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');

const maxAge = 3 * 24 * 60 * 60 * 1000
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

// signUp
module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body
    console.log(req.body);

    try {
        const user = await UserModel.create({pseudo, email, password})
        res.status(201).json({ user: user._id});
    }
    catch(err) {
        console.log(err);
        const errors = signUpErrors(err);
        res.status(400).send({ errors });
    }
}

// signIn
module.exports.signIn = async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)

    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge});
        res.status(200).json({ user: user._id, message: "connexion réussi", token})
    } catch (err) {
        const errors = signInErrors(err);
        res.status(500).json({ errors, error:'introuvable' });
    }
}

// logout
module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
} 