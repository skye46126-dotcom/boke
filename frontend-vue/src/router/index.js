import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/articles',
        name: 'ArticleList',
        component: () => import('../views/ArticleList.vue')
    },
    {
        path: '/articles/:slug',
        name: 'ArticleDetail',
        component: () => import('../views/ArticleDetail.vue')
    },
    {
        path: '/gallery',
        name: 'Gallery',
        component: () => import('../views/Gallery.vue')
    },
    {
        path: '/guestbook',
        name: 'Guestbook',
        component: () => import('../views/Guestbook.vue'),
        meta: {
            title: 'Pixel Guestbook'
        }
    },
    {
        path: '/projects',
        name: 'ProjectsIDE',
        component: () => import('../views/ProjectsIDE.vue'),
        meta: {
            title: 'VS Code - Projects',
            hideHeader: true,
            hideFooter: true
        }
    },
    {
        path: '/changelog',
        name: 'Changelog',
        component: () => import('../views/Changelog.vue'),
        meta: {
            title: 'Git Changelog'
        }
    },
    // 404 Catch-all route (must be last)
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }
        return { top: 0 }
    }
})

export default router
