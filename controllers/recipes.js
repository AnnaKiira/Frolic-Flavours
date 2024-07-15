const express = require('express')
const router = express.Router()

const Recipe = require('../models/recipe')

//recipes/index
router.get('/', async (req, res) => {
    try {
        const allRecipes = await Recipe.find().populate('owner')
        res.render('recipes/index', { recipes: allRecipes, })
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
        res.render('recipes/new', { errorMessage: error.message })
    }
})

//recipes/show
router.get('/:recipeId', async (req, res) => {
    try {
        const recipeId = req.params.recipeId
        const foundRecipe = await Recipe.findById(recipeId).populate('owner')

        if (!foundRecipe) {
            const error = new Error('Recipe Not Found')
            error.status = 404
            throw error
        }
        res.render('recipes/show', {
            recipe: foundRecipe
        })
    } catch (error) {
        console.log(error)
        if (error.status === 404) {
            return res.render('404.ejs')
        }
        res.redirect('/')
    }
})

module.exports = router