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
  background-color: black;
  color: #ff8a65;
  padding: 1rem;
  text-align: center;
  border-bottom: dotted 3px #ffccbc;
  width: 100%;
}
</style>
