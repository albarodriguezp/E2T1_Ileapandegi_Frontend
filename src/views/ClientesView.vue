<template>
  <div class="content">
    <div class="content2">
      <div class="buscador">
        <div class="icono-circulo">
          <i class="bi bi-search"></i>
        </div>
        <BarraBusqueda />
      </div>
        <div class="acciones">
          <button class="btn-eliminar">Eliminar</button>
          <button class="btn-agregar">Nuevo cliente</button>
        </div>

        <table class="tabla-clientes">
          <thead>
            <tr>
              <th>ID cliente</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Teléfono</th>
              <th>Acciones</th> 
            </tr>
          </thead>

          <tbody>
            <!-- Aquí irán los datos desde la BD -->
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="acciones-tabla">
                <button><i class="bi bi-pencil-square editar"></i></button>
                <button><i class="bi bi-trash eliminar"></i></button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td class="acciones">
                <button><i class="bi bi-pencil-square editar"></i></button>
                <button><i class="bi bi-trash eliminar"></i></button>
              </td>
            </tr>
          </tbody>
        </table>


      
    </div>
  </div>
</template>

<script setup>
    import BarraBusqueda from '@/components/BarraBusqueda.vue'
</script>

<style scoped>
.content {
  background: black;
  padding: 2rem;
  min-height: 100vh; 
  width: 100vh;
  border-radius: 10px;
}

.content2 {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  color: black;
}

.acciones {
  display: flex;
  justify-content: flex-end; 
  gap: 10px;
}

.acciones-tabla {
  display: flex; 
  gap: 10px;
}

.btn-eliminar {
  background-color: #EBB3B3;
  color: black;
  border-radius: 10px;
  border-color: #EBB3B3;
  font-weight: bold;
  padding: 10px 20px;
}

.btn-agregar {
  background-color: #9CE0DB;
  color: black;
  border-radius: 10px;
  border-color: #9CE0DB;
  font-weight: bold;
  padding: 10px 20px;
}

.buscador {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.icono-buscador {
  font-size: 1.4rem;
  color: gray;
}

.icono-circulo {
  width: 40px;
  height: 40px;
  background-color: #9CE0DB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icono-circulo i {
  color: black;
  font-size: 1.2rem;
}

.tabla-clientes {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  font-family: Arial, sans-serif;
  padding-top: 8rem; 
}


.tabla-clientes thead {
  background-color: #154E68; 
  color: white;
}

.tabla-clientes th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
}


.tabla-clientes td {
  padding: 12px;
  color: #000;
}


.tabla-clientes tbody tr:nth-child(odd) {
  background-color: #B6CCD1;
}

.tabla-clientes tbody tr:nth-child(even) {
  background-color: #F7F7F7;
}


.tabla-clientes td.acciones {
  display: flex;
  gap: 10px;
  align-items: center;
}

.editar {
  color: black;
  cursor: pointer;
}

.eliminar {
  color: red;
  cursor: pointer;
}

</style>
