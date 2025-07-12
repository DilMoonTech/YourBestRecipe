import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'

export const useRecipeStore = defineStore('recipe', () => {
  const searchQuery = ref('')
  const recipes = ref([])
  const status = ref('idle') // 'idle', 'loading', 'loaded', 'error'
  const selectedRecipe = ref(null)
  const suggestions = ref([])

  const updateRecipes = (newRecipes, newStatus = 'loaded') => {
    status.value = newStatus
    recipes.value = newRecipes.map(recipe => ({
      ...recipe,
      summary: recipe.summary?.replaceAll?.('https://spoonacular.com/recipes/(.*)', '/recipe/$1') || recipe.summary
    }))
    selectedRecipe.value = null
  }

  const selectRecipe = (recipeId) => {
    console.log('Selecting recipe:', recipeId)
    selectedRecipe.value = recipes.value.find(recipe => recipe.id === recipeId)
  }

  const findRecipeByName = (name, isSlug = false) => {
    const searchName = isSlug ? name : slugify(name)
    const recipe = recipes.value.find(recipe => 
      slugify(recipe.title) === searchName
    )
    
    if (recipe) {
      selectRecipe(recipe.id)
    }
    
    return recipe || null
  }

  const fetchRandomRecipes = async () => {
    console.log('Fetching random recipes')
    status.value = 'loading'
    
    try {
      const response = await api.get('/random', {
        params: { number: 12 }
      })
      updateRecipes(response.data.recipes)
      console.log('Random recipes loaded')
    } catch (error) {
      console.error('Error fetching random recipes:', error)
      status.value = 'error'
    }
  }

  const fetchRecipes = async (query) => {
    console.log('Fetching recipes for:', query)
    status.value = 'loading'
    
    try {
      const response = await api.get('/complexSearch', {
        params: { 
          query,
          number: 12,
          addRecipeInformation: true
        }
      })
      updateRecipes(response.data.results)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      status.value = 'error'
    }
  }

  // Helper function to create URL-friendly slugs
  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
  }

  return {
    searchQuery,
    recipes,
    status,
    selectedRecipe,
    suggestions,
    updateRecipes,
    selectRecipe,
    findRecipeByName,
    fetchRandomRecipes,
    fetchRecipes
  }
})