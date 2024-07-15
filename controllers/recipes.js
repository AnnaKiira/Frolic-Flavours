const express = require('express')
const router = express.Router()

const Recipe = require('../models/recipe.js')

//recipes/index
router.get('/', async (req, res) => {
    try {
        const allRecipes = await Recipe.find()
        res.render('recipes/index', { recipes: allRecipes })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

//recipes/new
router.get('/new', (req, res) => {
    try {
        return res.render('recipes/new')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

//recipes/create
router.post('/', async (req, res) => {
    try {
        const createRecipe = await Recipe.create(req.body)
        res.redirect('/recipes')
    } catch (error) {
        console.log(error)
        res.render('recipes/new', {errorMessage: error.message})
    }
})

//recipes/

module.exports = router