<script setup>
import Menu from './components/Menu.vue'
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
  background: url('@/assets/img/salon-belleza.jpg') center / cover no-repeat;
  justify-content: center;
}

</style>
