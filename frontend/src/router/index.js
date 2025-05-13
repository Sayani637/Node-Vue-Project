// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CardGallery from '../components/CardGallery.vue';
import CreateCard from '../components/CreateCard.vue';
import ContactPage from '../components/ContactPage.vue';
import SignUpPage from '../components/auth/SignUpPage.vue';
import LoginPage from '../components/auth/LoginPage.vue';

const routes = [
    { 
        path: '/', 
        name: 'SignUp', 
        component: SignUpPage 
    },
    { 
        path: '/login', 
        name: 'Login', 
        component: LoginPage 
    },
    { 
        path: '/gallery', 
        name: 'Home', 
        component: CardGallery 
    },
    { 
        path: '/create-card', 
        name: 'CreateCard', 
        component: CreateCard 
    },
    { 
        path: '/contact', 
        name: 'Contact', 
        component: ContactPage 
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
