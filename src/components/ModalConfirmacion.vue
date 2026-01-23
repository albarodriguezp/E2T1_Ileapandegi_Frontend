<template>
  <div v-if="mostrar" class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <h3>Eliminar usuarios</h3>
        <button class="btn-cerrar" @click="$emit('cancelar')" aria-label="Cerrar modal">&times;</button>
      </header>
      <p class="modal-mensaje">{{ mensaje }}</p>
      <footer class="modal-footer">
        <button class="btn-eliminar" @click="$emit('confirmar')">Eliminar</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mensaje: String,
  mostrar: Boolean
})
</script>

<style scoped>
.modal-backdrop {
  position: absolute;      /* relativo a .content2 */
  inset: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  justify-content: center; /* centro horizontal */
  align-items: center;     /* centro vertical */
  z-index: 1000;
}

.modal {
  background: white;
  width: 320px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  font-family: Arial, sans-serif;
  margin: 0 auto; 
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-weight: 700;
  font-size: 1.1rem;
  color: #111;
}

.btn-cerrar {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #444;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.btn-cerrar:hover {
  background-color: #eee;
}

.modal-mensaje {
  font-size: 0.9rem;
  color: #333;
  margin: 0;
  line-height: 1.3;
  text-align: left;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-eliminar {
  background-color: #c20b0b;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
}

.btn-eliminar:hover {
  background-color: #a10909;
}
</style>
