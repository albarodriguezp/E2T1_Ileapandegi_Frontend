<template>
  <div class="content">
    <div class="content2">
      <h1>{{ t('parameters.title') }}</h1>

      <div class="tabs">
        <button :class="{ active: activeTab === 'usuarios' }" @click="activeTab = 'usuarios'">
          {{ t('parameters.users') }}
        </button>
        <button :class="{ active: activeTab === 'grupos' }" @click="activeTab = 'grupos'">
          {{ t('parameters.groups') }}
        </button>
        <button :class="{ active: activeTab === 'turnos' }" @click="activeTab = 'turnos'">
          {{ t('parameters.shifts') }}
        </button>
      </div>

      <UsuariosSection v-if="activeTab === 'usuarios'" />
      <GruposSection v-if="activeTab === 'grupos'" />
      <TurnosSection v-if="activeTab === 'turnos'" />
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UsuariosSection from '@/components/parameters/UsuariosSection.vue'
import GruposSection from '@/components/parameters/GruposSection.vue'
import TurnosSection from '@/components/parameters/TurnosSection.vue'
const { t } = useI18n()

/* ===== Estado general ===== */
const activeTab = ref('usuarios')

</script>


<style scoped>
h1 {
  margin-bottom: 2rem;
  color: #164e63;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #e0e0e0;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.tabs button.active {
  background-color: #164e63;
  color: white;
}

.tab-content {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
}
</style>

