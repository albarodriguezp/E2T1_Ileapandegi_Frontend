<template>
  <div class="dia" :class="clase" @click="$emit('clickDia', numero)">
    {{ numero }}
  </div>
</template>


<script setup>
const emit = defineEmits(['clickDia'])

const props = defineProps({
  numero: {
    type: Number,
    required: true,
  },
  clase: {
    type: String,
    default: 'libre'
  }

})
function handleClick() {
  emit('clickDia', props.numero)
}


</script>

<style scoped>
.dia {
  background-color: #d7dad9;
  color: rgb(8, 8, 8);
  padding: 1rem 1rem 5rem;
  border-radius: 20px;
  cursor: pointer;

}

.libre { background-color: #e8f7f4 }
.media { background-color: #fff3cd }
.alta { background-color: #f8d7da }
.completo { background-color: #dc3545; color: white }

</style>