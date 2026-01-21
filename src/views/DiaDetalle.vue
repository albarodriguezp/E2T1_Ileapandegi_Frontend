<template>
  <div class="content">
    <div class="content2">
        <BarraBusqueda/>
      <h1>Citas del dia {{ dia }}</h1>
    </div>
  </div>
</template>

<script setup>
    import BarraBusqueda from '@/components/BarraBusqueda.vue'
    import { useRoute } from 'vue-router'

    const route = useRoute()
    const dia = route.params.dia
</script>

<style scoped>
.content {
  background: #222;
  padding: 0.7rem;
  min-height: 100vh;
  width: 100vh;
  border-radius: 20px;
}

.content2 {
  background: white;
  height: 100vh;
  border-radius: 20px;
  padding: 2rem;
  color: black;
}
</style>
