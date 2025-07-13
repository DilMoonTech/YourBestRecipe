<template>
  <q-page class="q-pa-md">
    <div
      v-if="loading"
      class="text-center"
    >
      <q-spinner
        size="50px"
        color="primary"
      />
      <p>Loading recipe details...</p>
    </div>
    
    <div
      v-else-if="error"
      class="text-center"
    >
      <q-icon
        name="error"
        color="negative"
        size="3rem"
      />
      <p class="text-negative">
        {{ error }}
      </p>
    </div>
    
    <div v-else-if="recipe">
      <q-card>
        <q-img
          :src="recipe.image"
          :alt="recipe.title"
          height="400px"
        />
        
        <q-card-section>
          <div class="text-h4">
            {{ recipe.title }}
          </div>
          <div class="text-subtitle2 text-grey-7">
            Ready in {{ recipe.readyInMinutes }} minutes • Serves {{ recipe.servings }}
          </div>
        </q-card-section>
        
        <q-card-section>
          <div class="text-h6">
            Summary
          </div>
          <div v-html="recipe.summary" />
        </q-card-section>
        
        <q-card-section v-if="recipe.analyzedInstructions && recipe.analyzedInstructions.length">
          <div class="text-h6">
            Instructions
          </div>
          <div
            v-for="(instruction, index) in recipe.analyzedInstructions"
            :key="index"
          >
            <q-list>
              <q-item
                v-for="step in instruction.steps"
                :key="step.number"
              >
                <q-item-section avatar>
                  <q-avatar
                    color="primary"
                    text-color="white"
                  >
                    {{ step.number }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  {{ step.step }}
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipeStore } from 'src/stores/recipe-store'

export default defineComponent({
  name: 'RecipeDetails',
  setup() {
    const route = useRoute()
    const recipeStore = useRecipeStore()
    const recipe = ref(null)
    const loading = ref(true)
    const error = ref(null)

    onMounted(async () => {
      try {
        const title = route.params.title
        // Try to find recipe by title slug
        const foundRecipe = recipeStore.findRecipeByName(title, true)
        
        if (foundRecipe) {
          recipe.value = foundRecipe
        } else {
          error.value = 'Recipe not found'
        }
      } catch (err) {
        error.value = 'Failed to load recipe details'
        console.error(err)
      } finally {
        loading.value = false
      }
    })

    return {
      recipe,
      loading,
      error
    }
  }
})
</script>