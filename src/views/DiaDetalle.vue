<template>
  <div class="content">
    <div class = "content2">
      <h1>Citas {{ dia }}/{{ mes + 1 }}/{{ ano }}</h1>
        <div class="contenedor-horario">
          <div class="columna-horas">
            <div v-for="hora in horasTurno" :key="hora"></div>
          </div>
        </div>

    </div>
  </div>

</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const dia = route.params.dia
const mes = Number(route.params.mes)
const ano = route.params.ano

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