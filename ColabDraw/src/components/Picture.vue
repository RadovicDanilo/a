<template>
    <v-card class="picture-container" elevation="2">
        <div class="canvas" :style="{
            gridTemplateColumns: `repeat(${picture.picture_data.length}, 1fr)`,
            gridTemplateRows: `repeat(${picture.picture_data.length}, 1fr)`,
        }" @click="editPicture">
            <div v-for="(row, rowIndex) in picture.picture_data" :key="rowIndex" class="pixel-row">
                <div v-for="(pixel, colIndex) in row" :key="colIndex" class="pixel" :style="{
                    backgroundColor: pixel,
                    width: pixelSize,
                    height: pixelSize
                }"></div>
            </div>
        </div>

        <v-card-title class="picture-info">
            <div class="info-left">
                <div class="title-author" @click="filterAuthor">
                    <h3 class="picture-title">{{ picture.name }}</h3>
                    <div class="picture-author">
                        <v-icon small class="mdi mdi-account"></v-icon>
                        {{ picture.author.username }}
                    </div>
                </div>
                <div class="picture-time">
                    <v-icon small class="mdi mdi-calendar"></v-icon>
                    Created: {{ formatUpdatedAt(picture.created_at) }}
                </div>
            </div>

            <v-btn @click="renamePicture">
                <v-icon color="primary" size="25px">mdi-pencil</v-icon>
            </v-btn>
            <v-btn style="align-items: center;" @click="deletePicture">
                <v-icon color="error" size="25px">mdi-delete</v-icon>
            </v-btn>
        </v-card-title>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { formatDistanceToNow } from 'date-fns';
import type { PropType } from "vue";
import type { PictureDto } from "@/types/pictures";
import router from "@/router";

export default defineComponent({
    name: "Picture",
    props: {
        picture: {
            type: Object as PropType<PictureDto>,
            required: true,
        },
    },
    setup(props, { emit }) {
        const testColor = "#FF0000";
        const GRID_CONTAINER_SIZE = 400;

        const pixelSize = computed(() =>
            `${GRID_CONTAINER_SIZE / props.picture.picture_data.length}px`
        );

        const deletePicture = () => {
            emit("delete", props.picture.picture_id);
        };

        const filterAuthor = () => {
            emit("filter", props.picture.author.user_id);
        };

        const editPicture = () => {
            router.push({ path: `/draw/${props.picture.picture_id}` });
        };

        const renamePicture = () => {
            emit("rename", props.picture);
        };

        const formatUpdatedAt = (updatedAt: string) => {
            const date = new Date(updatedAt);
            return formatDistanceToNow(date) + " ago";
        };

        return {
            testColor,
            pixelSize,
            deletePicture,
            filterAuthor,
            formatUpdatedAt,
            editPicture,
            renamePicture,
        };
    },
});
</script>

<style scoped>
.picture-container {
    display: flex;
    flex-direction: column;
    width: 400px;
    box-sizing: border-box;
    border: #ddd solid 1px;
}

.canvas {
    display: grid;
    align-self: center;
    border: 1px solid #ccc;
    margin-bottom: 16px;
    width: 400px;
    height: 400px;
}

.pixel {
    border: 0.1px solid #ddd;
    transition: background-color 0.3s ease;
}

.picture-info {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
}

.info-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}

.picture-title {
    margin: 0;
    font-size: 1.2rem;
    font-size: 2rem;
}

.picture-author {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 1rem;
}

.picture-author:hover {
    color: #007BFF;
    cursor: pointer;
}

.picture-time {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
    color: #555;
}

v-icon {
    font-size: 1rem;
}
</style>
