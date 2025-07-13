<template>
  <q-card-section>
    <q-item-label class="row items-center q-gutter-x-md">
      <q-chip
        icon="schedule"
        color="primary"
        text-color="white"
      >
        {{ readyInMinutes }} mins
      </q-chip>
      <q-chip
        icon="people"
        color="secondary"
        text-color="white"
      >
        {{ servings }} servings
      </q-chip>
      <q-chip
        icon="favorite"
        color="red"
        text-color="white"
      >
        {{ aggregateLikes }} likes
      </q-chip>
    </q-item-label>
  </q-card-section>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "RecipeMetrics",
  props: {
    readyInMinutes: {
      type: Number,
      default: 0,
    },
    servings: {
      type: Number,
      default: 0,
    },
    aggregateLikes: {
      type: Number,
      default: 0,
    },
  },
});
</script>
