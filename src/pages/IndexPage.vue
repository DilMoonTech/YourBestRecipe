<template>
  <q-page class="row items-center justify-evenly">
    <div class="row q-col-gutter-md q-pa-md">
      <!-- Loading State -->
      <div v-if="recipeStore.status === 'loading'" class="col-12 col-sm-6 col-md-4" v-for="n in 9" :key="n">
        <q-card flat bordered class="h-full">
          <q-skeleton height="300px" width="512px" />
          <q-card-section>
            <q-skeleton type="rect" />
            <q-skeleton type="text" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Error State -->
      <div v-else-if="recipeStore.status === 'error'" class="col-12 text-center">
        <q-icon name="error" color="negative" size="3rem" />
        <p class="text-negative">Failed to load recipes</p>
      </div>

      <!-- Recipe Cards -->
      <div v-else v-for="recipe in recipeStore.recipes" :key="recipe.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="h-full">
          <q-img
            :src="recipe.image"
            :ratio="16/9"
            :alt="recipe.title"
            @click="handleSelectedRecipe(recipe)"
          />
          
          <RecipeMetrics v-bind="recipe" />
          
          <q-card-section>
            <div class="text-h6">{{ recipe.title }}</div>
            <div class="text" v-html="sanitizeHtml(recipe.summary.slice(0, 100) + (recipe.summary.length > 100 ? '...' : ''))"></div>
          </q-card-section>
          
          <RecipeTags v-bind="recipe" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from 'src/stores/recipe-store'
import RecipeMetrics from 'src/components/RecipeMetrics.vue'
import RecipeTags from 'src/components/RecipeTags.vue'

// Simple HTML sanitizer (you might want to use a proper library like DOMPurify)
function sanitizeHtml(html) {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
}

export default defineComponent({
  name: 'IndexPage',
  components: {
    RecipeMetrics,
    RecipeTags
  },
  props: {
    recipes: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const recipeStore = useRecipeStore()
    const router = useRouter()

    function handleSelectedRecipe(recipe) {
      const slug = slugify(recipe.title)
      try {
        router.push({ name: 'recipe', params: { title: slug } })
      } catch (error) {
        console.error('Error in handleSelectedRecipe:', error)
      }
    }

    onMounted(() => {
      recipeStore.fetchRandomRecipes()
    })

    return {
      recipeStore,
      recipes: computed(() => recipeStore.recipes),
      handleSelectedRecipe,
      sanitizeHtml
    }
  }
})
</script>