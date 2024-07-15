const express = require('express')
const router = express.Router()

const Recipe = require('../models/recipe')

//recipes/index
router.get('/', async (req, res) => {
    try {
        const allRecipes = await Recipe.find().populate('owner')
        res.render('recipes/index.ejs', { recipes: allRecipes })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

//recipes/new
router.get('/new', (req, res) => {
    try {
        return res.render('recipes/new.ejs')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

//recipes/create
router.post('/', async (req, res) => {
    try {
        req.body.owner = req.session.user._id
        const createRecipe = await Recipe.create(req.body)
        res.redirect('/recipes')
    } catch (error) {
        console.log(error)
        res.render('recipes/new.ejs', { errorMessage: error.message })
    }
})

//recipes/show
router.get('/:recipeId', async (req, res) => {
    try {
        const recipeId = req.params.recipeId
        const recipe = await Recipe.findById(recipeId).populate('owner')

        if (!recipe) {
            const error = new Error('Recipe Not Found')
            error.status = 404
            throw error
        }
        res.render('recipes/show.ejs', {
            recipe
        })
    } catch (error) {
        console.log(error)
        if (error.status === 404) {
            return res.render('404.ejs')
        }
        res.redirect('/')
    }
})

//recipes/edit
router.get('/:recipeId/edit', async (req, res) => {
    try {
        const recipeId = req.params.recipeId
        const recipe = await Recipe.findById(recipeId)
        if (!recipeId) throw new Error('Recipe not found')

        if (recipeId.owner.equals(req.session.user._id)) {
            res.render('recipes/edit', { recipe: recipe })
        } else {
            res.redirect(`/recipes/${recipe._id}`)
        }
    } catch (error) {
        console.log(error)
        res.redirect('/recipes')
    }
})

//recipes/update
router.put('/:recipeId', async (req, res) => {
    try {
        const recipeId = await Recipe.findById(req.params.recipeId)
        if (!recipeId) throw new Error()
        
        if (recipeId.owner.equals(req.session.user._id)) {
            await Recipe.findByIdAndUpdate(recipeId, req.body)
            res.redirect(`/recipes/${recipeId}`)
        }
    } catch (error) {
        console.log(error)
        res.redirect('/recipes')
    }
})

module.exports = router