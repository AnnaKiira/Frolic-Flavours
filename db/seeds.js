const mongoose = require('mongoose')
require('dotenv').config()

const User = require('../models/user.js')
const Recipe = require('../models/recipe.js')

const userData = require('./data/users.js')
const recipeData = require('./data/recipes.js')

const seedDatabase = async () => {
    try {
        //1
        await mongoose.connect(process.env.MONGODB_URI)
        //2
        const deletedUsers = await User.deleteMany()
        const deletedRecipes = await Recipe.deleteMany()
        //3
        const users = await User.create(userData)
        const recipesWithOwners = recipeData.map(recipe => {
            recipe.owner = users[Math.floor(Math.random() * users.length)]._id
            recipe.favoritedByUsers = []
            const numOfFavorites = Math.floor(Math.random() * users.length)
            for (let i = 0; i < numOfFavorites; i++){
                recipe.favoritedByUsers.push(users[Math.floor(Math.random() * users.length)]._id)
            }
                recipe.favoritedByUsers = [... new Set(recipe.favoritedByUsers)]
            return recipe
        })
        //4
        const recipes = await Recipe.create(recipesWithOwners)
        //5
        await mongoose.connection.close()
    } catch (error) {
    console.log(error)
        //6
    } await mongoose.connection.close()
}

seedDatabase()