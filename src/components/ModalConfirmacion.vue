<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>Eliminar Usuarios</h3>
      <p>¿Estas seguro de que deseas eliminar los usuarios?</p>

      <div class="acciones">
        <button class="danger" @click="$emit('confirmar')">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  width: 300px;
}

.acciones {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1rem;
}

.danger {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
</style>
