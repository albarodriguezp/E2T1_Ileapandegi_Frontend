<template>
  <div class="content">
    <div class="content2">
      <h1 class="mb-2">Citas {{mes }}</h1>
      <Mes/>
    </div>
  </div>
</template>

<script setup>
import Mes from '@/components/Mes.vue';
const hoy = new Date();
const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const mes = meses[hoy.getMonth()];


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
