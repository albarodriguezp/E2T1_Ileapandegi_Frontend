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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
// Ekari data datuak 
const route = useRoute()
const dia = Number(route.params.dia)
const mes = Number(route.params.mes)
const ano = Number(route.params.ano)


const fechaSeleccionada = computed(() => new Date(ano, mes, dia))

//Azteazkena dela conprobatu beste horario bat duelako
const esMiercoles = computed(() => fechaSeleccionada.value.getDay() === 3)

// DE BD
const sillones = [1, 2, 3] 
//Azteazkenabada hordu bar beztela bezte bat
const horaInicio = computed(() => esMiercoles.value ? 9 : 10)
const horaFin = computed(() => esMiercoles.value ? 12.5 : 14.5)

const horasTurno = computed(() => {
  const slots = []
  for (let h = horaInicio.value; h < horaFin.value; h += 0.5) {
    slots.push(h)
  }
  return slots
})

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