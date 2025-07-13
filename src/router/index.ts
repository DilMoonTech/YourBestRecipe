import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory, Router } from 'vue-router'
import { StateInterface } from '../stores'
import routes from './routes'

export default route<StateInterface>(function (/* { store, ssrContext } */) {
  const createHistory = createWebHistory

  const Router: Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  return Router
})