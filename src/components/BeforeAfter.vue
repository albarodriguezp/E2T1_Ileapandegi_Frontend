<template>
  <div class="before-after-container">
    <div class="before-img">
      <img :src="antes" alt="Antes" />
    </div>

    <div class="after-img" :style="{ width: sliderValue + '%' }">
      <img :src="despues" alt="Después" />
    </div>

    <input
      type="range"
      min="0"
      max="100"
      v-model="sliderValue"
      class="slider"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  antes: String,
  despues: String
});

const sliderValue = ref(50);
</script>

<style scoped>
.before-after-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
}

.before-after-container img {
  width: 100%;
  display: block;
}

.after-img {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  height: 100%;
}

.slider {
  width: 100%;
  margin-top: 10px;
}
</style>