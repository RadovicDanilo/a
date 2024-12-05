<template>
  <nav>
    <div>
      <RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
      <RouterLink :to="{ name: 'gallery' }" class="nav-link">Gallery</RouterLink>
      <RouterLink v-if="isAuthenticated" :to="{ name: 'gallery', query: { user: username } }" class="nav-link">
        My Gallery
      </RouterLink>
      <RouterLink :to="{ name: 'draw' }" class="nav-link">Draw</RouterLink>
    </div>
    <div>
      <RouterLink v-if="!isAuthenticated" :to="{ name: 'register' }" class="nav-link">Register</RouterLink>
      <RouterLink v-if="!isAuthenticated" :to="{ name: 'login' }" class="nav-link">Login</RouterLink>
      <span v-if="isAuthenticated" class="nav-link">{{ username }}</span>
      <button v-if="isAuthenticated" @click="logout" class="nav-link logout-button">Logout</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { computed } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.token.length != 0);
const username = computed(() => authStore.username);

const logout = async () => {
  await authStore.logout();
  router.push({ name: 'home' });
};
</script>

<style scoped>
nav {
  background-color: #ffffff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid #b6b6b6a0;
}

.nav-link {
  color: #000000;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #b0fbe6;
}
</style>
