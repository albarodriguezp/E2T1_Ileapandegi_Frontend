<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"/>

  <div class="login-page">
    <!-- Fondo borroso -->
    <div class="bg-blur"></div>

    <!-- Selector de idioma -->
    <div class="language-selector">
      <select v-model="lang" class="form-select form-select-sm">
        <option value="es">ES</option>
        <option value="en">EN</option>
        <option value="eu">EU</option>
      </select>
    </div>

    <!-- Card -->
    <div class="card login-card shadow">
        <h3>{{ t.loginTitle }}</h3>

        <form @submit.prevent="login">
          <div class="mb-3">
            <label class="form-label">{{ t.user }}</label>
            <input type="text" class="form-control" v-model="usuario" :placeholder="t.userPlaceholder" required/>
          </div>

          <div class="mb-3 password-wrapper">
            <label class="form-label">{{ t.password }}</label>
            <div class="password-field">
              <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="password" :placeholder="t.passwordPlaceholder" required />
              <span class="toggle-password" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
          </div>

          <button class="btn btn-primary">{{ t.button }}</button>
        </form>
      </div>
  </div>
</template>


<script setup>
    import { ref, computed } from 'vue'
    import { messages } from '@/utils/translations.js' // importando el archivo
    import { useRouter } from 'vue-router'
    
    const router = useRouter()
    const lang = ref(navigator.language.slice(0,2) in messages ? navigator.language.slice(0,2) : 'es')
    const usuario = ref('')
    const password = ref('')
    const showPassword = ref(false)

    // Computed para acceder fácilmente a los textos
    const t = computed(() => messages[lang.value])

    const login = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: usuario.value,
        password: password.value
      })
    })

    if (!res.ok) {
      throw new Error('Credenciales incorrectas')
    }

    const data = await res.json()

    // Guardar token
    sessionStorage.setItem('token', data.token)

    router.push('/home')
  } catch (err) {
    console.error('Error en login:', err)
  }
}

</script>

<style lang="scss" scoped>
/* Asegurar que html y body ocupen toda la pantalla y centrar la card */

.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  /* Fondo borroso */
  .bg-blur {
    position: fixed;
    inset: 0;
    background: url('@/assets/img/salon-belleza.jpg') center / cover no-repeat;
    filter: blur(4px);
    transform: scale(1.1);
    z-index: -1;
  }

  /* Selector de idioma flotante */
  .language-selector {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 10;
    select {
      border-radius: 0.5rem;
      padding: 0.5rem 0.8rem;
      font-size: 0.9rem;
      cursor: pointer;
    }
  }

  /* Card centrada */
  .login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .login-card {
    width: 100%;
    max-width: 650px;
    padding: 3rem 4rem;
    border-radius: 1.8rem;
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.35);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.35);
    }

    h3 {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 2rem;
      letter-spacing: 0.5px;
    }

    .form-label {
      font-weight: 600;
      display: block;
      margin-bottom: 0.5rem;
    }

    .form-control {
      border-radius: 0.85rem;
      padding: 1rem 1.2rem;
      font-size: 1.05rem;
      margin-bottom: 1.5rem;
    }

    .btn-primary {
      border-radius: 1rem;
      padding: 1rem;
      font-size: 1.15rem;
      font-weight: 600;
      width: 100%;
      background: #154E68;
      color: white;
      border: none;
      transition: filter 0.3s ease;

      &:hover {
        filter: brightness(1.1);
      }
    }
  }

  .password-wrapper {
    position: relative;

    .password-field {
      position: relative;

      .toggle-password {
        position: absolute;
        right: 1rem;
        top: 35%;
        transform: translateY(-50%);
        cursor: pointer;
        font-size: 1.2rem;
        color: #555;

        &:hover {
          color: #0d6efd;
        }
      }
    }
  }
}
</style>
