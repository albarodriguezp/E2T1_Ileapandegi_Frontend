<template>
  <div 
    class="dia" 
    :class="[ocupacionClass, { 'dia-hoy': esHoy, 'dia-pasado': esPasado }]" 
    @click="handleClick"
  >
    <p>{{ numero }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['clickDia'])

const props = defineProps({
  numero: {
    type: Number,
    required: true,
  },
  ocupacion: {
    type: String,
    default: 'empty',
    validator: (value) => ['empty', 'low', 'medium', 'high'].includes(value)
  },
  esHoy: {
    type: Boolean,
    default: false
  },
  esPasado: {
    type: Boolean,
    default: false
  }
})

const ocupacionClass = computed(() => `ocupacion-${props.ocupacion}`)

function handleClick() {
  emit('clickDia', props.numero) 
}
</script>

<style scoped>
.dia {
  color: rgb(8, 8, 8);
  padding: 1rem 1rem 5rem;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  border: 3px solid transparent;
}

.dia:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.dia-hoy {
  border: 3px solid #084b56 !important; 
  box-shadow: 0 0 12px rgba(22, 78, 99, 0.4);
  font-weight: bold;
}


.dia-pasado {
  background-color: #e0e0e0 !important; 
  color: #9e9e9e;
  cursor: default;
  opacity: 0.7;
}

.dia-pasado:hover {
  transform: none;
  box-shadow: none;
}

.ocupacion-empty:not(.dia-pasado) {
  background-color: #e8f5e9; 
}

.ocupacion-low:not(.dia-pasado) {
  background-color: #c8e6c9; 
}

.ocupacion-medium:not(.dia-pasado) {
  background-color: #fff9c4; 
}

.ocupacion-high:not(.dia-pasado) {
  background-color: #ffccbc; 
}
</style>