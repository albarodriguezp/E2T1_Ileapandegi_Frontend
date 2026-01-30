<template>
  <div class="content">
    <div class="content2">
      <h1>Hola {{  capitalizar(nombre) }}, estas son tus citas!</h1>
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
</style>
