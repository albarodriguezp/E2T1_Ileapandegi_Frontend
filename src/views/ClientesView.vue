<template>
  <div class="content">
    <div class="content2">
        <BarraBusqueda/>
      <h1>CLIENTES VIEW</h1>
    </div>
  </div>
</template>

<script setup>
    import BarraBusqueda from '@/components/BarraBusqueda.vue'
</script>

<style scoped>
.content {
  background: black;
  padding: 2rem;
  min-height: 100vh; 
  width: 100vh;
  border-radius: 10px;
}

.content2 {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  color: black;
}
</style>
