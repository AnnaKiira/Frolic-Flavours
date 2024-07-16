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
        const recipe = await Recipe.findById(req.params.recipeId)
        if (!recipe) throw new Error('Recipe not found')

        if (recipe.owner.equals(req.session.user._id)) {
            res.render('recipes/edit.ejs', { recipe })
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

//recipes/delete
router.delete('/:recipeId', async (req, res) => {
    try {
        const deleteRecipe = await Recipe.findById(req.params.recipeId)
        if (deleteRecipe.owner.equals(req.session.user._id)) {
            await deleteRecipe.deleteOne()
            res.redirect('/recipes')
        } else {
            res.send('Only the owner have permission to delete this recipe')
        }
    } catch (error) {
        res.redirect('/')
    }
})

module.exports = router