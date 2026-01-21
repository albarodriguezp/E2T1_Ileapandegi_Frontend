<template>
  <div class="content">
    <div class="content2">
      <h1>Citas del dia {{ dia }}</h1>
      
  <div class="grid grid-rows-24">
  <div
    v-for="hora in 24"
    :key="hora"
    class="fila-hora"
  >
    {{ hora }}:00
    <div v-if="citas[hora]" class="bloque-cita">
      {{ citas[hora].titulo }}
    </div>
  </div>
  </div>
    </div>
  </div>
</template>

<script setup>
    import { useRoute } from 'vue-router'

    const route = useRoute()
    const dia = route.params.dia

    import { ref } from 'vue'
    const citas = ref([
    { titulo: 'Reunión con Juan', inicio: '09:00', fin: '10:00', descripcion: 'Sala 1' },
    { titulo: 'Llamada cliente', inicio: '11:00', fin: '11:30', descripcion: 'Zoom' },
    { titulo: 'Revisar informe', inicio: '14:00', fin: '15:30', descripcion: 'Oficina' }
    ])
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
