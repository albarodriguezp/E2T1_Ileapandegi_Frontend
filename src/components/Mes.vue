<template>
    <div class="mes mt-3">
        <div
            v-for="dia in semana"
            :key="dia"
            class="cabecera"
        >
            {{ dia }}
        </div>

        <div
      v-for="(dia, index) in mes"
      :key="index"
    >
      <Dia 
      v-if="dia" :numero="dia.dia"
      @clickDia="abrirDia" />
    </div>
    </div>

</template>


<script setup>
import router from '@/router';
import Dia from './Dia.vue';
import { computed } from 'vue'

function abrirDia(dia){
    router.push({ name: 'DiaDetalle', params: { dia: dia, mes: mesActual, ano: ano } })
}

const semana = ['L', 'M', 'X', 'J', 'V']
const hoy = new Date();

const ano = hoy.getFullYear();
const mesActual = hoy.getMonth();

const mes = computed(() => {
  const dias = []

  const primerDiaSemana = new Date(ano, mesActual, 1).getDay()

  const offset = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1
  for (let i = 0; i < Math.min(offset, 5); i++) {
    dias.push(null)
  }
  const ultimoDia = new Date(ano, mesActual + 1, 0).getDate()
  for (let d = 1; d <= ultimoDia; d++) {
    const fecha = new Date(ano, mesActual, d)
    const diaSemana = fecha.getDay()

    
    if (diaSemana >= 1 && diaSemana <= 5) {
      dias.push({
        dia: d,
        fecha: fecha.toISOString()
      })
    }
  }

  return dias
})
</script>

<style scoped>
.mes {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}
.cabecera {
  text-align: center;
  font-weight: bold;
}
</style>