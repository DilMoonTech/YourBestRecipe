<script setup>
// import { useRecipeStore } from 'src/stores/recipe-store'

// const store = useRecipeStore()
// store.fetchCuisines()
import italianFood from "../../assets/iamges/cuisine/italian-food_480x480.jpg"

const cuisineList = [
        { name: 'Italian', country: 'Italy', image: italianFood },
        { name: 'Chinese', country: 'China', image: 'https://spoonacular.com/recipeImages/stirfry.jpg' },
        { name: 'Indian', country: 'India', image: 'https://spoonacular.com/recipeImages/curry.jpg' },
        { name: 'French', country: 'France', image: 'https://spoonacular.com/recipeImages/croissant.jpg' },
        { name: 'Thai', country: 'Thailand', image: 'https://spoonacular.com/recipeImages/padthai.jpg' },
        { name: 'Japanese', country: 'Japan', image: 'https://spoonacular.com/recipeImages/sushi.jpg' },
        { name: 'Greek', country: 'Greece', image: 'https://spoonacular.com/recipeImages/gyros.jpg' }
      ];
</script>

<template>
  <div
    v-for="cuisine in cuisineList"
    :key="cuisine.name"
  >
    <img
      :src="cuisine.image"
      :alt="cuisine.name"
    >
    <h3>{{ cuisine.name }}</h3>
    <p>{{ cuisine.country }}</p>
  </div>
</template>
