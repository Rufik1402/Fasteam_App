import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HackathonsView from "../views/HackathonsView.vue";
import UsersView from "../views/UsersView.vue";

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/hackathons',
        name: 'hackathons',
        component: () => import('../views/HackathonsView.vue')
    },
    {
        path: '/hackathons/new',
        name: 'new-hackathon',
        component: () => import('../views/NewHackathonView.vue')
    },
    {
        path: '/hackathons/:id/edit',
        name: 'edit-hackathon',
        component: () => import('../views/EditHackathonView.vue')
    },
    {
        path: '/users',
        name: 'users',
        component: () => import('../views/UsersView.vue')
    },
    {
        path: '/hackathons/:id/edit',
        name: 'edit-hackathon',
        component: () => import('../views/EditHackathonView.vue'),
        props: true // Передает параметры как props
    },
    {
        path: '/hackathons/:id',
        name: 'hackathon-details',
        component: () => import('../views/HackathonDetailsView.vue'),
        props: true
    },
    {
        path: '/teams',
        name: 'Teams',
        component: () => import('../views/TeamsView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/teams',
        name: 'Teams',
        component: () => import('../views/TeamsView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/teams/:id',
        name: 'TeamDetails',
        component: () => import('../views/TeamDetailsView.vue'),
        meta: { requiresAuth: true },
        props: true
    },
    {
        path: '/admins',
        name: 'Admins',
        component: () => import('../views/AdminsView.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})



export default router