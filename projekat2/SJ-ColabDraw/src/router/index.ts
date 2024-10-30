import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/HomeView.vue';
import Login from '@/views/LoginView.vue';
import Register from '@/views/RegisterView.vue';
import Gallery from '@/views/GalleryView.vue';
import Image from '@/views/ImageView.vue';
import Drawing from '@/views/DrawingView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: Gallery,
    },
    {
      path: '/image/:id',
      name: 'image',
      component: Image,
    },
    {
      path: '/draw/:id',
      name: 'drawing',
      component: Drawing,
    },
  ],
});

export default router;
