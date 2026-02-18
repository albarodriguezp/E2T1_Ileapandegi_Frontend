<template>
  <nav class="sidebar">
    <div class="topbar">
      <div class="logo">
        <img src="@/assets/img/logoSanturtzi.png" alt="Santurtzi LHFP" />
      </div>

      <button
        class="hamburger"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-label="Abrir menú"
        @click="toggleMenu"
      >
        {{ isMenuOpen ? '✕' : '☰' }}
      </button>
    </div>

    <div class="menu-content" :class="{ open: isMenuOpen }">
      <ul class="menu">
        <li>
          <router-link to="/home" active-class="active" @click="closeMenu">{{ t('menu.home') }}</router-link>
        </li>
        <li>
          <router-link to="/inventario" active-class="active" @click="closeMenu">{{ t('menu.inventory') }}</router-link>
        </li>
        <li>
          <router-link to="/clientes" active-class="active" @click="closeMenu">{{ t('menu.clients') }}</router-link>
        </li>
        <li>
          <router-link to="/citas" active-class="active" @click="closeMenu">{{ t('menu.appointments') }}</router-link>
        </li>
        <li>
          <router-link to="/perfil" active-class="active" @click="closeMenu">{{ t('menu.profile') }}</router-link>
        </li>

        <!-- Enlace solo para Admin -->
        <li v-if="rol === 'A'">
          <router-link to="/parametrizacion" active-class="active" @click="closeMenu">{{ t('menu.settings') }}</router-link>
        </li>
      </ul>
      <button class="btn-logout" type="button" @click="handleLogout">
        <i class="bi bi-box-arrow-right" aria-hidden="true"></i>
        <span>{{ t('menu.logout') }}</span>
      </button>
      <div class="idioma">
        <IdiomaSelector />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import IdiomaSelector from '@/components/SelectorIdioma.vue'
import { getProfile } from '@/services/api'
import { logout } from '@/utils/auth'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const rol = ref('')
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  } finally {
    closeMenu()
    router.push({ name: 'login' })
  }
}

// Cargar rol del usuario 
onMounted(async () => {
  try {
    const data = await getProfile()
    rol.value = data.rol || '' 
  } catch (error) {
    console.error('Error al obtener rol del usuario:', error)
  }
})

watch(
  () => route.path,
  () => {
    closeMenu()
  }
)
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

.topbar {
  display: block;
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
}

.menu-content {
  display: flex;
  flex-direction: column;
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

.idioma {
  margin-top: auto; 
}

.btn-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: 100%;
  margin-top: auto;
  margin-bottom: 0.75rem;
  padding: 0.85rem 1rem;
  border: 1px solid #ef5350;
  border-radius: 0.5rem;
  background: linear-gradient(180deg, #ef5350 0%, #d32f2f 100%);
  color: #fff;
  letter-spacing: 0.4px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 0 3px 10px rgba(211, 47, 47, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.btn-logout:hover {
  filter: brightness(1.05);
  box-shadow: 0 5px 14px rgba(211, 47, 47, 0.45);
  transform: translateY(-1px);
}

.btn-logout:active {
  transform: translateY(0);
}

.btn-logout i {
  font-size: 1rem;
}

.hamburger {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    min-height: auto;
    padding: 0;
    background: transparent;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #222;
    padding: 0.75rem 1rem;
  }

  .logo {
    margin-bottom: 0;
  }

  .logo img {
    width: 100px;
  }

  .hamburger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 0.5rem;
    background: transparent;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .menu-content {
    display: none;
    margin: 0;
    background: #fff;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  .menu-content.open {
    display: flex;
  }

  .menu a {
    padding: 0.85rem 1rem;
    color: #222;
  }

  .menu a:hover,
  .menu a.active {
    color: #fff;
  }

  .idioma {
    margin-top: 1rem;
    padding: 0 1rem 1rem;
  }

  .btn-logout {
    margin: 0 1rem;
    width: calc(100% - 2rem);
    justify-content: center;
  }
}
</style>
