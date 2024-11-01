<template>
  <nav>
    <RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
    <RouterLink :to="{ name: 'gallery' }" class="nav-link">Gallery</RouterLink>
    <RouterLink :to="{ name: 'draw' }" class="nav-link">Draw</RouterLink>
    <RouterLink :to="{ name: 'register' }" class="nav-link"
      >Register</RouterLink
    >
    <RouterLink :to="{ name: 'login' }" class="nav-link">Login</RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
nav {
  background-color: #f5f5f5;
  color: #333;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.nav-link {
  color: #111111;
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border-radius: 3px;
}
</style>
