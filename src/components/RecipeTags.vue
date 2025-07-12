<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-chip
        v-if="vegetarian"
        icon="eco"
        color="green-6"
        text-color="white"
        class="glossy"
      >
        Vegetarian
      </q-chip>
      
      <q-chip
        v-if="vegan"
        icon="grass"
        color="green"
        text-color="white"
        class="glossy"
      >
        Vegan
      </q-chip>
      
      <q-chip
        v-if="glutenFree"
        icon="breakfast_dining"
        color="warning"
        text-color="white"
        class="glossy"
      >
        Gluten Free
      </q-chip>
      
      <q-chip
        v-if="dairyFree"
        icon="egg_alt"
        color="info"
        text-color="white"
        class="glossy"
      >
        Dairy Free
      </q-chip>
      
      <q-chip
        v-for="cuisine in cuisines"
        :key="cuisine"
        icon="restaurant"
        color="blue-10"
        text-color="white"
        class="glossy"
      >
        {{ cuisine }}
      </q-chip>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RecipeTags',
  props: {
    vegetarian: {
      type: Boolean,
      default: false
    },
    vegan: {
      type: Boolean,
      default: false
    },
    glutenFree: {
      type: Boolean,
      default: false
    },
    dairyFree: {
      type: Boolean,
      default: false
    },
    cuisines: {
      type: Array,
      default: () => []
    }
  }
})
</script>