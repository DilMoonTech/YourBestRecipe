const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'recipe/:title',
        name: 'recipe',
        component: () => import('pages/RecipeDetails.vue')
      },
      {
        path: 'cuisine',
        name: 'cuisine',
        component: () => import('pages/Categories/CuisinePage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes