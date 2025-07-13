import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "src/boot/axios";

interface Recipe {
  id: number;
  title: string;
  summary?: string;
  image?: string;
}

interface Cuisine {
  name: string;
  country: string;
  image: string;
}

type Status = 'idle' | 'loading' | 'loaded' | 'error';

export const useRecipeStore = defineStore("recipe", () => {
  const searchQuery = ref("");
  const recipes = ref<Recipe[]>([]);
  const status = ref<Status>("idle");
  const selectedRecipe = ref<Recipe | null>(null);
  const suggestions = ref<string[]>([]);
  const cuisines = ref<Cuisine[]>([]);
  const CACHE_DURATION = 30 * 60 * 1000; //  minutes

  // Auto-load cached recipes on store init
  const initCache = () => {
    const cached = getFromCache('random');
    if (cached) {
      updateRecipes(cached.data);
    }
  };

  const getFromCache = (key) => {
    const cached = sessionStorage.getItem(`recipe_${key}`);
    if (!cached) return null;
    const data = JSON.parse(cached);
    return Date.now() - data.timestamp < CACHE_DURATION ? data : null;
  };

  const setCache = (key, data) => {
    sessionStorage.setItem(`recipe_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  const fetchCuisines = async () => {
    // const cached = getFromCache('cuisines');
    // if (cached) {
    //   cuisines.value = cached.data;
    //   return;
    // }

    try {
      const cuisineList = [
        { name: 'Italian', country: 'Italy', image: 'src/assets/cuisine/italian-food.png' },
        { name: 'Chinese', country: 'China', image: 'https://spoonacular.com/recipeImages/stirfry.jpg' },
        { name: 'Indian', country: 'India', image: 'https://spoonacular.com/recipeImages/curry.jpg' },
        { name: 'French', country: 'France', image: 'https://spoonacular.com/recipeImages/croissant.jpg' },
        { name: 'Thai', country: 'Thailand', image: 'https://spoonacular.com/recipeImages/padthai.jpg' },
        { name: 'Japanese', country: 'Japan', image: 'https://spoonacular.com/recipeImages/sushi.jpg' },
        { name: 'Greek', country: 'Greece', image: 'https://spoonacular.com/recipeImages/gyros.jpg' }
      ];

      // setCache('cuisines', cuisineList);
      cuisines.value = cuisineList;
    } catch (error) {
      console.error('Error fetching cuisines:', error);
    }
  };

  const updateRecipes = (newRecipes, newStatus = "loaded") => {
    status.value = newStatus;
    recipes.value = newRecipes.map((recipe) => ({
      ...recipe,
      summary:
        recipe.summary?.replaceAll?.(
          "https://spoonacular.com/recipes/(.*)",
          "/recipe/$1"
        ) || recipe.summary,
    }));
    selectedRecipe.value = null;
  };

  const selectRecipe = (recipeId) => {
    selectedRecipe.value = recipes.value.find(
      (recipe) => recipe.id === recipeId
    );
  };

  const findRecipeByName = (name, isSlug = false) => {
    const searchName = isSlug ? name : slugify(name);
    const recipe = recipes.value.find(
      (recipe) => slugify(recipe.title) === searchName
    );

    if (recipe) {
      selectRecipe(recipe.id);
    }

    return recipe || null;
  };

  const fetchRandomRecipes = async () => {
    const cached = getFromCache('random');
    if (cached) {
      updateRecipes(cached.data);
      return;
    }

    status.value = "loading";

    try {
      const response = await api.get("/random", {
        params: { number: 12 },
      });
      setCache('random', response.data.recipes);
      updateRecipes(response.data.recipes);
    } catch (error) {
      status.value = "error";
      throw (error)
    }
  };

  const fetchRecipes = async (query) => {
    const cached = getFromCache(`search:${query}`);
    if (cached) {
      updateRecipes(cached.data);
      return;
    }

    console.log("Fetching recipes for:", query);
    status.value = "loading";

    try {
      const response = await api.get("/complexSearch", {
        params: {
          query,
          number: 12,
          addRecipeInformation: true,
        },
      });
      setCache(`search:${query}`, response.data.results);
      updateRecipes(response.data.results);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      status.value = "error";
    }
  };

  // Helper function to create URL-friendly slugs
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  }

  // Auto-initialize cache
  initCache();

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
    fetchRecipes,
    cuisines,
    fetchCuisines,
  };
});
