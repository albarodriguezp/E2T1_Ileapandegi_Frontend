<template>
  <div class="content">
    <div class="content2">
      <h1>Hola {{ capitalizar(nombre) }}, estas son tus citas!</h1>

      <div class="dashboard d-flex justify-content-center gap-5">
        <div class="miniContenedor">
          <p>Total citas: {{ totalCitas }}</p>
          <p class="number">5</p>
        </div>
        <div class="miniContenedor">
          <p>Citas de hoy: {{ totalCitas }}</p>
          <p class="number">5</p>
        </div>
        <div class="miniContenedor">
          <p>Completadas: {{ totalCitas }}</p>
          <p class="number">5</p>
        </div>
      </div>
      <div class="proximasCitas">
          <p>Próximas citas:</p>

          <div class="cita">
            <div class="headerCita d-flex justify-content-between">
              <p>10:00 - 12:00</p>
              <p>2024-06-15</p>
            </div>
            <div class="bodyCita mt-2">
              <p>Lavado y secado</p>
              <p>Alergia altinte</p>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>


const nombre = localStorage.getItem('name')

const obtenerCitasPorUsuario = async () => {
  cargando.value = true
  error.value = null

  const token = localStorage.getItem('token')
  const idUsuario = localStorage.getItem('user_id')

  try {
    const res = await fetch(
      `http://localhost:8000/api/appointments/by-id?id=${idUsuario}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!res.ok) {
      throw new Error(`Error al obtener citas del usuario ${idUsuario}`)
    }

    const data = await res.json()

    data.forEach(cita => {
      console.log('Cita ID:', cita.id)
      console.log('Fecha y Hora:', cita.date_time)
      console.log('Descripción:', cita.description)
      console.log('Estado:', cita.status)
      console.log('---------------------------')
    });


  } catch (err) {
    error.value = err.message
    console.error('Error:', err)
  } finally {
    cargando.value = false
  }
}


function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
</script>

<style scoped>
.content {
  background: #222;
  padding: 2rem;
  min-height: 100vh;
  width: 100%;
}

.content2 {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  color: black;
  height: 90vh;
}

.miniContenedor {
  background: #d3f0ec;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 1rem;
  /*width: fit-content;*/
}

.miniContenedor p {
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
}

.number {
  font-size: 2rem !important;
  color: #164e63;
}

.proximasCitas {
  margin-top: 2rem;
  background: #a8caca;
  border-radius: 10px;
  padding: 1.5rem;
}

.cita {
  background: #ffffff;
  padding: 1rem;
  border-radius: 10px;
  border-left: #394242 5px solid;
}

.headerCita p {
  font-weight: bold;
}
</style>
