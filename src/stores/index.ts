import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'

export interface StateInterface {
  // Define the stores states here
}

export default store(() => {
  const pinia = createPinia()
  return pinia
})