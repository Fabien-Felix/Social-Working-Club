const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const app = express();


//    =======> Permet de traiter le requête
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// Server utiliser avec .env (port 3000)
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})