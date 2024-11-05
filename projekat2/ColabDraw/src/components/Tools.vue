<template>
  <div class="tools">
    <div v-for="tool in tools">
      <div
        class="tool"
        @click="selectTool(tool[0])"
        :class="{ selected: currentTool === tool[0] }"
      >
        <span :class="['mdi', tool[1], 'tool-icon']"></span>
      </div>
    </div>
    <input
      type="color"
      v-model="currentColor"
      class="color-picker"
      @input="updateColor(currentColor)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from "vue";

const emit = defineEmits<{
  (e: "colorSelected", color: string): void;
}>();

type Tool = [name: string, icon: string];

const tools: Tool[] = [
  ["brush", "mdi-brush"],
  ["eraser", "mdi-eraser"],
];

const currentTool = ref("brush");
const currentColor = ref("#000000");

const selectTool = (tool: string) => {
  currentTool.value = tool;
};

const updateColor = (newColor: string) => {
  emit("colorSelected", newColor);
};
</script>

<style scoped>
.tools {
  display: flex;
  flex-direction: column;
  margin: 10px;
  align-items: center;
}

.tool {
  margin: 5px;
  padding: 10px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 0.3s;
  height: fit-content;
  width: fit-content;
}

.tool-icon {
  font-size: 40px;
}

.tool:hover {
  background-color: #eee;
}

.selected {
  border-color: #ffffff;
}

.color-picker {
  margin: 5px;
  padding: 10px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 0.3s;
  height: 70px;
  width: 70px;
}
</style>
