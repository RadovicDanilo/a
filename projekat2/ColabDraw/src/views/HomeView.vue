<template>
  <Header title="ColabDraw" />
  <div class="container">
    <p class="description">ColabDraw - Collaborative pixel art platform</p>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: calc(100vh - 50px);
  font-family: "Arial", sans-serif;
}

.description {
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-top: 20px;
  max-width: 600px;
  line-height: 1.6;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}
</style>
