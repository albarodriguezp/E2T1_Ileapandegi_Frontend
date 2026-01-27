<template>
  <div class="content">
    <div class="content2">
      <div class="header">
        <div class="navegacion-fecha">
          <button class="btn-nav" @click="cambiarDia(-1)">←</button>
          <h1>Citas {{ diaReactivo }}/{{ mesReactivo + 1 }}/{{ anoReactivo }}</h1>
          <button class="btn-nav" @click="cambiarDia(1)">→</button>
        </div>
        <button class="btn-nueva-cita" @click="mostrarModal = true">
          + Nueva Cita
        </button>
      </div>

      <div class="contenido-centrado">
        <div class="contenedor-horario" :style="{ '--ancho-sillon': anchoSillon + 'px' }">
          <!-- scroll -->
          <div class="wrapper-scroll">
            <div class="cabecera-sillones">
              <div class="columna-horas-header"></div>
              <div class="contenedor-headers-sillones">
                <div v-for="silla in sillones" :key="silla" class="silla">
                  Silla {{ silla }}
                </div>
              </div>
            </div>

            <div class="cuerpo-horario">
              <div class="columna-horas">
                <div v-for="hora in horasTurno" :key="hora" class="slot-hora">
                  {{ formatHora(hora) }}
                </div>
              </div>

              <div class="contenedor-sillones">
                <div v-for="silla in sillones" :key="silla" class="columna-sillon">
                  <div v-for="hora in horasTurno" :key="hora" class="slot-fondo"></div>
                  
                  <div v-for="cita in citasDeSillon(silla)" :key="cita.id"
                    class="bloque-cita"
                    :style="{
                      top: cita.top + 'px',
                      height: cita.height + 'px'
                    }">
                    <p>{{ formatHora(cita.inicio) }}</p>
                    <p>-</p>
                    <p>{{ formatHora(cita.fin) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nueva Cita -->
    <ModalNuevaCita
      v-if="mostrarModal"
      :fecha="fechaStr"
      :sillones="sillones"
      :citas-existentes="citasPosicion"
      @guardar="handleNuevaCita"
      @cerrar="mostrarModal = false"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModalNuevaCita from '../components/ModalNuevaCita.vue'

const route = useRoute()
const router = useRouter()

const diaReactivo = ref(Number(route.params.dia))
const mesReactivo = ref(Number(route.params.mes))
const anoReactivo = ref(Number(route.params.ano))

const fechaSeleccionada = computed(() => new Date(anoReactivo.value, mesReactivo.value, diaReactivo.value))
const esMiercoles = computed(() => fechaSeleccionada.value.getDay() === 3)

const fechaStr = computed(() => 
  `${anoReactivo.value}-${(mesReactivo.value+1).toString().padStart(2,'0')}-${diaReactivo.value.toString().padStart(2,'0')}`
)

const slotHeight = 40
const anchoSillon = 150 
const mostrarModal = ref(false)

// sillones desde front tmb FALTA CAMBIAR POR ESTUDIANTES DEL DÍA
const sillonesDisponibles = ref([1, 2, 3, 4, 5])

const citas = ref([])
const cargando = ref(false)
const error = ref(null)

const sillones = computed(() => {
  if (!Array.isArray(citas.value)) return sillonesDisponibles.value
  
  const sillonesConCitas = citas.value.map(c => c.silla)
  const todosSillones = [...new Set([...sillonesDisponibles.value, ...sillonesConCitas])]
  return todosSillones.sort((a, b) => a - b)
})

const horaInicio = computed(() => esMiercoles.value ? 9 : 10)
const horaFin = computed(() => esMiercoles.value ? 12.5 : 14.5)

const horasTurno = computed(() => {
  const slots = []
  for (let h = horaInicio.value; h < horaFin.value; h += 0.25) {
    slots.push(h)
  }
  return slots
})

function formatHora(hora) {
  const h = Math.floor(hora)
  const m = Math.round((hora - h) * 60)
  return `${h}:${m.toString().padStart(2,'0')}`
}

function horaToDecimal(time) {
  const [h, m] = time.split(':').map(Number)
  return h + m / 60
}

const obtenerCitas = async () => {
  cargando.value = true
  error.value = null

  const token = localStorage.getItem('token')

  try {
    const res = await fetch(
      `http://localhost:8000/api/appointments/by-date?date=${fechaStr.value}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!res.ok) {
      throw new Error('Error al obtener citas')
    }

    const data = await res.json()

    const appointments = Array.isArray(data) ? data : []
    citas.value = appointments.map(c => ({
      id: c.id,
      silla: c.seat,
      comentario: c.comments || 'Sin comentario',
      inicio: horaToDecimal(c.start_time),
      fin: horaToDecimal(c.end_time)
    }))

  } catch (err) {
    error.value = err.message
  } finally {
    cargando.value = false
  }
}

const citasPosicion = computed(() => {
  if (!Array.isArray(citas.value)) return []
  return citas.value.map(cita => ({
    ...cita,
    top: (cita.inicio - horaInicio.value) * slotHeight / 0.25,
    height: (cita.fin - cita.inicio) * slotHeight / 0.25
  }))
})

function citasDeSillon(silla) {
  return citasPosicion.value.filter(c => c.silla === silla)
}

function cambiarDia(incremento) {
  const nuevaFecha = new Date(anoReactivo.value, mesReactivo.value, diaReactivo.value)
  nuevaFecha.setDate(nuevaFecha.getDate() + incremento)
  
  router.push({
    name: route.name,
    params: {
      dia: nuevaFecha.getDate(),
      mes: nuevaFecha.getMonth(),
      ano: nuevaFecha.getFullYear()
    }
  })
}

function handleNuevaCita(nuevaCita) {
  obtenerCitas()
}

// Para cambiar cada vez que cambian los params de la ruta (al cambiar dia)
watch(() => route.params, (newParams) => {
  diaReactivo.value = Number(newParams.dia)
  mesReactivo.value = Number(newParams.mes)
  anoReactivo.value = Number(newParams.ano)
  obtenerCitas()
}, { immediate: true })

onMounted(() => {
  obtenerCitas()
})
</script>

<style scoped>
.content {
  background: #222;
  padding: 0.7rem;
  min-height: 100vh;
  width: 100vw;
  border-radius: 20px;
  box-sizing: border-box;
}

.content2 {
  background: white;
  min-height: 100vh;
  border-radius: 20px;
  padding: 2rem;
  color: black;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.navegacion-fecha {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-nav {
  background-color: #e0e0e0;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.2s;
}

.btn-nav:hover {
  background-color: #d0d0d0;
}

.btn-nueva-cita {
  background-color: #82d8d8;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
}

.btn-nueva-cita:hover {
  background-color: #6bc5c5;
}

.contenedor-horario {
  width: 100%;
  max-width: 100%;
}

.contenido-centrado{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  width: 100%;
  padding: 0 2rem;
  box-sizing: border-box;
}

.wrapper-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.cabecera-sillones {
  display: flex;
  margin-bottom: 5px;
  min-width: fit-content;
}

.columna-horas-header {
  width: 100px;
  flex-shrink: 0;
  position: sticky;
  left: 0;
  background: white;
  z-index: 10;
}

.contenedor-headers-sillones {
  display: flex;
}

.silla {
  width: var(--ancho-sillon);
  flex-shrink: 0;
  text-align: center;
  font-weight: bold;
  border-left: 1px solid #ddd;
}

.cuerpo-horario {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 20px;
  min-width: fit-content;
}

.columna-horas {
  width: 100px;
  flex-shrink: 0;
  border-right: 2px solid #999;
  background: white;
  position: sticky;
  left: 0;
  z-index: 10;
}

.slot-hora {
  height: 40px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  padding: 2px 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.contenedor-sillones {
  display: flex;
}

.columna-sillon {
  width: var(--ancho-sillon);
  flex-shrink: 0;
  position: relative;
  border-left: 1px solid #ddd;
}

.slot-fondo {
  height: 40px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}

.bloque-cita {
  position: absolute;
  width: calc(100% - 8px);
  left: 4px;
  background-color: #77cfad;
  color: #000;
  padding: 1rem;
  border-radius: 30px;
  font-size: 12px;
  box-sizing: border-box;
  overflow: hidden;
  font-weight: 500;
  text-align: center;
}
</style>