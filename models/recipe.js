const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({

  nameOfRecipe: {
    type: String,
    required: true
  },

  instructions: {
    type: String,
    required: true
  },
  preparationTime: {
    type: String,
    required: true
  },
  cookingTime: {
    type: String,
    required: true,
    min: 0
  },
  servings: {
    type: Number,
    required: true,
    min: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  favoritedByUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe