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
    "#ff8a65",
    "#ffccbc",
    "#ff5722",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
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
    cursor: pointer;
    border: 1px solid #ccc;
    transition: transform 0.3s;
  }

  .color-swatch:hover {
    transform: scale(1.1);
  }
</style>
