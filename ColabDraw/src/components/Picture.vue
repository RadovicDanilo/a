<template>
    <v-card class="picture-container" elevation="2">
        <v-card-text>
            <div class="canvas" :style="{
                gridTemplateColumns: `repeat(${picture.picture_data.length}, 1fr)`,
                gridTemplateRows: `repeat(${picture.picture_data.length}, 1fr)`,
            }">
                <div v-for="(row, rowIndex) in picture.picture_data" :key="rowIndex" class="pixel-row">
                    <div v-for="(pixel, colIndex) in row" :key="colIndex" class="pixel" :style="{
                        backgroundColor: pixel,
                        width: pixelSize,
                        height: pixelSize
                    }"></div>
                </div>
            </div>
        </v-card-text>
        <v-card-title>
            <div class="picture-info">
                <h3 class="picture-title">{{ picture.name }}</h3>
                <v-spacer></v-spacer>
                <v-btn icon color="error" @click="deletePicture">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </div>
        </v-card-title>
        <v-card-subtitle class="picture-author">
            <v-icon class="mdi mdi-account" small></v-icon>
            {{ picture.author.username }}
        </v-card-subtitle>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import type { PropType } from "vue";
import type { PictureDto } from "@/types/pictures";

export default defineComponent({
    name: "Picture",
    props: {
        picture: {
            type: Object as PropType<PictureDto>,
            required: true,
        },
    },
    setup(props, { emit }) {
        const testColor = "#FF0000"
        const GRID_CONTAINER_SIZE = 300;

        const pixelSize = computed(() =>
            `${GRID_CONTAINER_SIZE / props.picture.picture_data.length}px`
        );

        const deletePicture = () => {
            emit("delete", props.picture.picture_id);
        };

        return {
            testColor,
            pixelSize,
            deletePicture,
        };
    },
});
</script>

<style scoped>
.picture-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
}

.canvas {
    display: grid;
    border: 1px solid #ccc;
    margin-bottom: 16px;
    width: fit-content;
    height: 300px;
    overflow: hidden;
}

.pixel {
    border: 0.1px solid #ddd;
    transition: background-color 0.3s ease;
}

.picture-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.picture-title {
    margin: 0;
    font-size: 1.2rem;
}

.picture-author {
    display: flex;
    align-items: center;
    gap: 5px;
}

v-icon {
    font-size: 1.2rem;
}
</style>
