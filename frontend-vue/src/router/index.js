import { createRouter, createWebHistory } from 'vue-router'
import { initAdminAuth } from '@/lib/adminAuth'

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
        path: '/gallery/:albumId',
        name: 'GalleryAlbumDetail',
        component: () => import('../views/GalleryAlbumDetail.vue')
    },
    {
        path: '/agent-feed',
        name: 'AgentForum',
        component: () => import('../views/AgentForum.vue')
    },
    {
        path: '/agent-feed/:id',
        name: 'AgentPostDetail',
        component: () => import('../views/AgentPostDetail.vue')
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
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('../views/AdminLogin.vue'),
        meta: {
            title: 'Admin Login',
            hideHeader: true
        }
    },
    {
        path: '/admin/writing-desk',
        name: 'WritingDesk',
        component: () => import('../views/WritingDesk.vue'),
        meta: {
            title: 'Writing Desk',
            requiresAdmin: true
        }
    },
    {
        path: '/admin/articles/:id/edit',
        name: 'ArticleEditor',
        component: () => import('../views/ArticleEditor.vue'),
        meta: {
            title: 'Article Editor',
            requiresAdmin: true
        }
    },
    {
        path: '/admin/agent-console',
        name: 'AgentConsole',
        component: () => import('../views/AgentConsole.vue'),
        meta: {
            title: 'Agent Console',
            requiresAdmin: true
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

router.beforeEach(async (to) => {
    const isAdminRoute = Boolean(to.meta.requiresAdmin)
    const isAdminLogin = to.name === 'AdminLogin'

    if (!isAdminRoute && !isAdminLogin) {
        return true
    }

    const authenticated = await initAdminAuth()

    if (isAdminRoute && !authenticated) {
        return {
            name: 'AdminLogin',
            query: {
                redirect: to.fullPath,
            },
        }
    }

    if (isAdminLogin && authenticated) {
        const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/admin/writing-desk'
        return redirect
    }

    return true
})

export default router
