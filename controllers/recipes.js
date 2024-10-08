const express = require('express')
const router = express.Router()

const Recipe = require('../models/recipe.js')


router.get('/', async (req, res) => {
    try {
        const allRecipes = await Recipe.find().populate('owner')
        res.render('recipes/index.ejs', { recipes: allRecipes })
    } catch (error) {
        res.redirect('/')
    }
})


router.get('/new', (req, res) => {
    try {
        return res.render('recipes/new.ejs')
    } catch (error) {
        res.redirect('/')
    }
})


router.post('/', async (req, res) => {
    try {
        req.body.owner = req.session.user._id
        const createRecipe = await Recipe.create(req.body)
        res.redirect('/recipes')
    } catch (error) {
        res.render('recipes/new.ejs', { errorMessage: error.message })
    }
})


router.get('/:recipeId', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate('owner')
        if (!recipe) {
            const error = new Error('Recipe Not Found')
            error.status = 404
            throw error
        }
        const userFavRecipe = recipe.favoritedByUsers.some(objectId => {
            return objectId.equals(req.session.user._id)
        })
        res.render('recipes/show.ejs', {
            recipe,
            userFavRecipe
        })
    } catch (error) {
        if (error.status === 404) {
            return res.render('404.ejs')
        }
        res.redirect('/')
    }
})


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
        res.redirect('/recipes')
    }
})


router.put('/:recipeId', async (req, res) => {
    try {
        const recipeId = await Recipe.findById(req.params.recipeId)
        if (!recipeId) throw new Error()

        if (recipeId.owner.equals(req.session.user._id)) {
            await Recipe.findByIdAndUpdate(recipeId, req.body)
            res.redirect(`/recipes/${recipeId}`)
        }
    } catch (error) {
        res.redirect('/recipes')
    }
})


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


router.post('/:recipeId/favorited-by/:userId', async (req, res) => {
    try {
        const recipeId = req.params.recipeId
        const favRecipe = await Recipe.findByIdAndUpdate(recipeId, {
            $push: { favoritedByUsers: req.session.user._id }
        })
        res.redirect(`/recipes/${recipeId}`)
    } catch (error) {
        res.redirect('/recipes')
    }
})


router.delete('/:recipeId/favorited-by/:userId', async (req, res) => {
    try {
        const recipeId = req.params.recipeId
        await Recipe.findByIdAndUpdate(recipeId, {
            $pull: { favoritedByUsers: req.session.user._id }
        })
        res.redirect(`/recipes/${recipeId}`)
    } catch (error) {
        res.redirect('/')
    }
})



module.exports = router