const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up');
});

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in');
});

router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.send('Username already taken.');
        }
        if (req.body.password !== req.body.confirmPassword) {
            return res.send('Passwords do not match');
        }
        req.body.password = bcrypt.hashSync(req.body.password, 12);
        const user = await User.create(req.body);
        res.send(`Thanks for signing up ${user.username}!`);

        //return res.redirect('/auth/sign-in') ---> figure out how to redirect to /auth/sign-in once user has received the thank you for signing up message above
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
});

router.post("/sign-in", async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (!userInDatabase) {
            return res.send("Login failed. Please try again.");
        }
        const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
        if (!validPassword) {
            return res.send("Login failed. Please try again.");
        }

        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id
        }

        req.session.save(() => {
            res.redirect('/')
        })

    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
