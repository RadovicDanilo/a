import { createRouter, createWebHistory } from 'vue-router';
import { getAllJSDocTags } from 'typescript';

import Home from '@/views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Gallery from '../views/Gallery.vue';
import Image from '../views/Image.vue';
import Drawing from '../views/Drawing.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: Gallery,
    },
    {
      path: '/image/:id',
      name: 'Image',
      component: Image,
    },
    {
      path: '/draw/:id',
      name: 'Drawing',
      component: Drawing,
    },
  ],
});

export default router;
