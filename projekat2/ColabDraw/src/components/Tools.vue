<template>
  <div class="tools">
    <div
      class="tool"
      @click="selectTool('brush')"
      :class="{ selected: currentTool === 'brush' }"
    >
      <span>Brush (DODAJ IKONU)</span>
    </div>
    <div class="tool" @click="openColorPicker">
      <div
        class="color-display"
        :style="{ backgroundColor: currentColor }"
      ></div>
    </div>
    <ColorPicker v-if="showColorPicker" @colorSelected="updateColor" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ColorPicker from "./ColorPicker.vue";

const currentTool = ref("brush");
const currentColor = ref("#ff8a65");
const showColorPicker = ref(false);

const selectTool = (tool: string) => {
  currentTool.value = tool;
};

const openColorPicker = () => {
  showColorPicker.value = !showColorPicker.value;
};

const updateColor = (newColor: string) => {
  currentColor.value = newColor;
  showColorPicker.value = false;
};
</script>

<style scoped>
.tools {
  display: flex;
  flex-direction: column;
  margin: 10px;
}

.tool {
  margin: 5px;
  padding: 10px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 0.3s;
}

.tool:hover {
  background-color: #eee;
}

.selected {
  border-color: #ff8a65;
}

.color-display {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
}
</style>
