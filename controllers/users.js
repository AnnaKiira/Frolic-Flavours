const express = require('express')
const router = express.Router()

const Recipe = require('../models/recipe.js')

router.get('/profile', async (req, res) => {
    try {
        const ownedRecipes = await Recipe.find({
            owner: req.session.user._id
        }).exec()

        const favoritedRecipes = await Recipe.find({
            favoritedByUsers: req.session.user._id
        }).populate('owner').exec()

        res.render('users/show.ejs', {
            ownedRecipes,
            favoritedRecipes
        })
    } catch (error) {
        res.redirect('/')
    }
})

module.exports = router