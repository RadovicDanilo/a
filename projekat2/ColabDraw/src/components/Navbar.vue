<template>
  <nav>
    <div >
      <RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
      <RouterLink :to="{ name: 'gallery' }" class="nav-link"
        >Gallery</RouterLink
      >
      <RouterLink :to="{ name: 'draw' }" class="nav-link">Draw</RouterLink>
    </div>
    <div>
      <RouterLink :to="{ name: 'register' }" class="nav-link"
        >Register</RouterLink
      >
      <RouterLink :to="{ name: 'login' }" class="nav-link">Login</RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
nav {
  background-color: #ffffff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid #b6b6b6a0
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
