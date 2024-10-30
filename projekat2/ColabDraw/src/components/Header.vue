<template>
  <div class="header">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: String;
}>();
</script>

<style scoped>
.header {
  background-color: #222;
  color: #ff8a65;
  padding: 1.5rem;
  text-align: center;
  border-bottom: 3px dotted #ffccbc;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0;
  font-size: 2rem;
  font-family: 'Arial', sans-serif;
}
</style>
