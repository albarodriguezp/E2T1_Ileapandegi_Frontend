<template>
  <div class="content">
    <div class="content2">
      <h1>Citas {{ dia }}/{{ mes + 1 }}/{{ ano }}</h1>
      <div class="contenido-centrado">
      <div class="contenedor-horario" :style="{ '--ancho-sillon': anchoSillon + 'px' }">
        <div class="cabecera-sillones">
          <div class="columna-horas-header"></div>
          <div v-for="silla in sillones" :key="silla" class="silla">
            Silla {{ silla }}
          </div>
        </div>

        <div class="cuerpo-horario">
          <div class="columna-horas">
            <div v-for="hora in horasTurno" :key="hora" class="slot-hora">
              {{ formatHora(hora) }}
            </div>
          </div>

          <!-- FONDO GRID PARA LOS SILLONES -->
          <div class="contenedor-sillones">
            <div v-for="silla in sillones" :key="silla" class="columna-sillon">
              <!-- FONDO GRID EN LOS SLOTS -->
              <div v-for="hora in horasTurno" :key="hora" class="slot-fondo"></div>
              
              <!-- Citas del sillon -->
              <div v-for="cita in citasDeSillon(silla)" :key="cita.titulo"
                class="bloque-cita"
                :style="{
                  top: cita.top + 'px',
                  height: cita.height + 'px'
                }">
                <p>{{ cita.titulo }}</p>
                <p>{{ cita.inicio }}</p>
                <p>-</p>
                <p>{{ cita.fin }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const dia = Number(route.params.dia)
const mes = Number(route.params.mes)
const ano = Number(route.params.ano)

const fechaSeleccionada = computed(() => new Date(ano, mes, dia))
const esMiercoles = computed(() => fechaSeleccionada.value.getDay() === 3)


const sillones = [1, 2, 3, 4, 5] 
const slotHeight = 40
const anchoSillon = 150 


/*const sillones = computed(() => {
  if (!Array.isArray(citas.value)) return []
  return [...new Set(citas.value.map(c => c.silla))].sort()
})*/


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

const citas = ref([])
const cargando = ref(false)
const error = ref(null)

const obtenerCitas = async () => {
  cargando.value = true
  error.value = null

  const token = localStorage.getItem('token')
  const fechaStr = `${ano}-${(mes+1).toString().padStart(2,'0')}-${dia.toString().padStart(2,'0')}`
  console.log(token)

  try {
    const res = await fetch(
      `http://localhost:8000/api/appointments/by-date?date=${fechaStr}`,
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
    console.log('API response:', data)

    const appointments = Array.isArray(data) ? data : []
    citas.value = appointments.map(c => ({
      ...c,
      inicio: horaToDecimal(c.inicio),
      fin: horaToDecimal(c.fin)
    }))

  } catch (err) {
    error.value = err.message
  } finally {
    cargando.value = false
  }
}



function horaToDecimal(time) {
  const [h, m] = time.split(':').map(Number)
  return h + m / 60
}


const citasPosicion = computed(() =>{
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

.contenedor-horario {
  width: fit-content; 
}

.contenido-centrado{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}

.cabecera-sillones {
  display: flex;
  margin-bottom: 5px;
}

.columna-horas-header {
  width: 100px;
  flex-shrink: 0;
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
  overflow-x: auto;

}

.columna-horas {
  width: 100px;
  flex-shrink: 0;
  border-right: 2px solid #999;
  background: white;
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