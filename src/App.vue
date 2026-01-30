<script setup>
import Menu from './components/AppMenu.vue'
import Login from './views/LoginView.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <!-- LOGIN -->
   <div v-if="route.name === 'login'">
    <Login />
   </div>

  <!-- RESTO DE LA APP -->
  <div v-else class="app-layout">
    <Menu />
    <router-view />
  </div>
</template>

<style>
.app-layout {
  display: flex;
  min-height: 100vh;
  justify-content: center;
}

.content {
  background: #222;
  padding: 2rem;
  min-height: 100vh;
  width: 100%;
}

.content2 {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  color: black;
  overflow-y: auto;
}
</style>
