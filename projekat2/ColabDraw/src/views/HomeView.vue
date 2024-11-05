<template>
  <div class="container">
    <img src="@/assets/icon-big.png" alt="ColabDraw" class="image" />
    <p class="title">ColabDraw</p>
    <p class="description">Collaborative pixel art platform</p>
    <div class="button-container">
      <RouterLink :to="{ name: 'draw' }" class="nav-button">
        <span class="mdi mdi-arrow-right"></span> Start Drawing
      </RouterLink>
      <RouterLink :to="{ name: 'gallery' }" class="nav-button">
        <span class="mdi mdi-arrow-right"></span> View Gallery
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: first baseline;
  padding: 40px;
  min-height: 100vh;
}

.image {
  border: 1px solid #000000;
  max-width: 400px;
  max-height: 400px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.title {
  font-size: 2.5rem;
  color: #002f32;
  max-width: 400px;
  line-height: 1.6;
  padding: 10px;
  text-align: center;
}

.description {
  font-size: 1.5rem;
  color: #003d4b;
  max-width: 400px;
  line-height: 1.6;
  padding: 10px;
  text-align: center;
}

.button-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.nav-button {
  padding: 15px 30px;
  color: #ffffff;
  background-color: #028ea4;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  font-size: 1.2rem;
}

.nav-button:hover {
  background-color: #005673;
}

.mdi {
  margin-right: 8px;
}
</style>
