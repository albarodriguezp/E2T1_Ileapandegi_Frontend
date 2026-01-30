<template>
  <div class="content">
    <div class="content2">
      <h1>Mi portfolio</h1>

      <!-- Grid de trabajos -->
      <div class="portfolio-grid">
        <div
          class="card"
          v-for="trabajo in trabajos"
          :key="trabajo.id"
        >
          <!-- Vista previa: mostramos el después -->
          <img :src="trabajo.despues" alt="Trabajo realizado" />

          <h3>{{ trabajo.titulo }}</h3>
          <p>{{ trabajo.descripcionCorta }}</p>
          <button @click="abrirModal(trabajo)">Ver</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalAbierto" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Información del trabajo</h2>
          <button class="close" @click="modalAbierto = false">✕</button>
        </div>

        <!-- Slider Antes / Después -->
        <BeforeAfter
          :antes="trabajoSeleccionado.antes"
          :despues="trabajoSeleccionado.despues"
        />

        <p><strong>Cliente:</strong> {{ trabajoSeleccionado.cliente }}</p>
        <p><strong>Fecha:</strong> {{ trabajoSeleccionado.fecha }}</p>
        <p><strong>Descripción:</strong></p>
        <p>{{ trabajoSeleccionado.descripcionLarga }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BeforeAfter from "@/components/BeforeAfter.vue";

const modalAbierto = ref(false);
const trabajoSeleccionado = ref({});

const trabajos = ref([
  {
    id: 1,
    titulo: "Tinte con técnica de balayage",
    descripcionCorta: "Balayage en tonos naturales.",
    descripcionLarga:
      "Se realizó un balayage suave para dar luminosidad y profundidad al cabello, finalizando con peinado ondulado.",
    cliente: "Laura García",
    fecha: "15/01/2026",
    antes: "https://via.placeholder.com/300x200?text=Antes",
    despues: "https://via.placeholder.com/300x200?text=Después"
  },
  {
    id: 2,
    titulo: "Corte y peinado",
    descripcionCorta: "Corte moderno con capas.",
    descripcionLarga:
      "Corte en capas largas para dar volumen y movimiento, acompañado de un brushing.",
    cliente: "María López",
    fecha: "20/01/2026",
    antes: "https://via.placeholder.com/300x200?text=Antes",
    despues: "https://via.placeholder.com/300x200?text=Después"
  },
  {
    id: 3,
    titulo: "Mechas rubias",
    descripcionCorta: "Mechas con acabado natural.",
    descripcionLarga:
      "Aplicación de mechas rubias con matiz frío para un resultado elegante y natural.",
    cliente: "Ana Ruiz",
    fecha: "22/01/2026",
    antes: "https://via.placeholder.com/300x200?text=Antes",
    despues: "https://via.placeholder.com/300x200?text=Después"
  }
]);

function abrirModal(trabajo) {
  trabajoSeleccionado.value = trabajo;
  modalAbierto.value = true;
}
</script>

<style scoped>
h1 {
  margin-bottom: 2rem;
}

/* Grid */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

/* Card */
.card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.card img {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 0.5rem;
}

.card button {
  margin-top: 0.5rem;
  background: #5ec7b7;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  color: #000;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  width: 450px;
  max-width: 95%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>