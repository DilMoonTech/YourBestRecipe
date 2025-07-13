<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Your Best Recipe
        </q-toolbar-title>

        <div>{{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label
          header
          class="flex justify-between items-center"
        >
          Essential Links
          <q-btn
            flat
            dense
            round
            icon="close"
            @click="leftDrawerOpen = false"
          />
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { version } from '../../package.json'

const linksList = [
  {
    title: 'Home',
    caption: 'Browse recipes',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Recipes',
    caption: 'Find your favorite recipes',
    icon: 'restaurant',
    link: '/recipes'
  }
]

const leftDrawerOpen = ref(false)
const essentialLinks = linksList

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleClickOutside = (event) => {
  const drawer = document.querySelector('.q-drawer')
  const menuBtn = document.querySelector('[aria-label="Menu"]')
  
  if (leftDrawerOpen.value && drawer && !drawer.contains(event.target) && !menuBtn?.contains(event.target)) {
    leftDrawerOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineOptions({
  name: 'MainLayout'
})
</script>
