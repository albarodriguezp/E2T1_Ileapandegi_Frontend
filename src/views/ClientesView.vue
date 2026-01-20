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
  padding: 2rem; /* espacio alrededor del contenido */
  min-height: 100vh; /* opcional para que ocupe toda la pantalla */
  border-radius: 10px;
}

.content2 {
  background: white;
  border-radius: 10px; /* CORRECTO para bordes redondeados */
  padding: 2rem;
  color: black;
}
</style>
