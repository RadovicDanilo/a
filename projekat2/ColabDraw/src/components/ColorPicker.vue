<template>
  <div class="color-picker">
    <h3>Select a Color</h3>
    <div class="colors">
      <div
        v-for="color in colorOptions"
        :key="color"
        class="color-swatch"
        :style="{ backgroundColor: color }"
        @click="selectColor(color)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits<{
  (e: "colorSelected", color: string): void;
}>();

const colorOptions = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#ffc107",
  "#ff8a65",
  "#ffccbc",
  "#ff5722",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#4caf50",
];

const selectColor = (color: string) => {
  emit("colorSelected", color);
};
</script>

<style scoped>
.color-picker {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 10;
}

.colors {
  display: flex;
  flex-wrap: wrap;
}

.color-swatch {
  width: 30px;
  height: 30px;
  margin: 5px;
  border: 1px solid #000;
  transition: transform 0.2s;
}

.color-swatch:hover {
  transform: scale(1.3);
}
</style>
