<template>
  <nav class="sidebar">
    <div class="logo">
      <img src="@/assets/img/logoSanturtzi.png" alt="Santurtzi LHFP" />
    </div>

    <ul class="menu">
      <li>
        <router-link to="/home" active-class="active">INICIO</router-link>
      </li>
      <li>
        <router-link to="/inventario" active-class="active">INVENTARIO</router-link>
      </li>
      <li>
        <router-link to="/clientes" active-class="active">CLIENTES</router-link>
      </li>
      <li>
        <router-link to="/portfolio" active-class="active">PORTFOLIO</router-link>
      </li>
      <li>
        <router-link to="/citas" active-class="active">CITAS</router-link>
      </li>
       <li>
        <router-link to="/perfil" active-class="active">PERFIL</router-link>
      </li>
    </ul>
  </nav>
</template>


<script setup>

</script>

<style scoped>
/* Sidebar */
.sidebar {
  width: 240px;
  background-color: #222; 
  color: white;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  user-select: none;
}

.logo {
  margin-bottom: 3rem;
  display: flex;
  justify-content: center;
}

.logo img {
  width: 130px;
  user-select: none;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.menu li {
  margin-bottom: 0.5rem;
}

.menu a {
  display: block;
  padding: 1rem 1.5rem;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.25s ease;
}

.menu a:hover,
.menu a.active {
  background-color: #1f8aa0; 
}
</style>