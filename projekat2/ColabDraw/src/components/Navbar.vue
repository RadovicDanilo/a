<template>
  <nav>
    <RouterLink :to="{ name: 'home' }">Home</RouterLink>
    <RouterLink :to="{ name: 'gallery' }">Draw</RouterLink>
    <RouterLink :to="{ name: 'draw' }">Draw</RouterLink>
    <RouterLink :to="{ name: 'register' }">Register</RouterLink>
    <RouterLink :to="{ name: 'login' }">Login</RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
nav {
  background-color: #333;
  color: #ff8a65;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 3px dotted #ffccbc;
}

.nav-link {
  color: #ffccbc;
  text-decoration: none;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #555;
  color: #fff;
}
</style>
