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
      v-for="(dia, index) in diasMes"
      :key="index"
    >
      <Dia 
        v-if="dia" 
        :numero="dia.dia"
        :ocupacion="dia.ocupacion"
        :es-hoy="dia.esHoy"
        :es-pasado="dia.esPasado"
        @clickDia="abrirDia" 
      />
    </div>
  </div>
</template>

<script setup>
import router from '@/router'
import Dia from './Dia.vue'
import { computed, watch, ref } from 'vue'
import { getMonthOccupancy } from '@/services/api'

const props = defineProps({
  mes: {
    type: Number,
    required: true
  },
  ano: {
    type: Number,
    required: true
  }
})

const ocupacionMes = ref({})

const cargarOcupacion = async () => {
  try {
    const data = await getMonthOccupancy(props.ano, props.mes)
    ocupacionMes.value = data
  } catch (err) {
    console.error('Error al cargar ocupación:', err)
    ocupacionMes.value = {}
  }
}

watch(() => [props.mes, props.ano], () => {
  cargarOcupacion()
}, { immediate: true })

function abrirDia(dia) {
  router.push({ 
    name: 'DiaDetalle', 
    params: { 
      dia: dia, 
      mes: props.mes, 
      ano: props.ano 
    } 
  })
}

const semana = ['L', 'M', 'X', 'J', 'V']

function formatearFecha(ano, mes, dia) {
  const year = ano.toString()
  const month = (mes + 1).toString().padStart(2, '0')
  const day = dia.toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

const hoy = new Date()
const hoyDia = hoy.getDate()
const hoyMes = hoy.getMonth()
const hoyAno = hoy.getFullYear()

const diasMes = computed(() => {
  const dias = []

  const primerDiaSemana = new Date(props.ano, props.mes, 1).getDay()

  const offset = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1
  for (let i = 0; i < Math.min(offset, 5); i++) {
    dias.push(null)
  }

  const ultimoDia = new Date(props.ano, props.mes + 1, 0).getDate()
  for (let d = 1; d <= ultimoDia; d++) {
    const fecha = new Date(props.ano, props.mes, d)
    const diaSemana = fecha.getDay()

    if (diaSemana >= 1 && diaSemana <= 5) {
      const fechaStr = formatearFecha(props.ano, props.mes, d)
      const ocupacionData = ocupacionMes.value[fechaStr]
      const ocupacion = ocupacionData?.level || 'empty'
      
      // comprueba si es hoy
      const esHoy = d === hoyDia && props.mes === hoyMes && props.ano === hoyAno
      
      // comprueba si es pasado
      const esPasado = new Date(props.ano, props.mes, d) < new Date(hoyAno, hoyMes, hoyDia)
      
      dias.push({
        dia: d,
        fecha: fechaStr,
        ocupacion: ocupacion,
        esHoy: esHoy,
        esPasado: esPasado
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
  width: 100%;
  box-sizing: border-box;
}

.cabecera {
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem;
}

@media (max-width: 768px) {
  .mes {
    gap: 0.75rem;
  }

  .cabecera {
    font-size: 0.9rem;
    padding: 0.4rem;
  }
}

@media (max-width: 480px) {
  .mes {
    gap: 0.5rem;
  }

  .cabecera {
    font-size: 0.75rem;
    padding: 0.25rem;
  }
}
</style>