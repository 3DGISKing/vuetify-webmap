import { createRouter, createWebHistory } from "vue-router/auto";
import { useStore } from "vuex";

// navigation guard to redirect to login page
const requireAuth = (to: unknown, from: unknown, next: unknown) => {
    const store = useStore();

    if (!store.state.user) {
        // @ts-ignore
        next({ name: "Signin" });
    } else {
        // @ts-ignore
        next();
    }
};

const redirectIfLoggedIn = (to: unknown, from: unknown, next: unknown) => {
    const store = useStore();

    if (store.state.user) {
        // @ts-ignore
        next({ name: "Main" });
    } else {
        // @ts-ignore
        next();
    }
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Main",
            component: () => import("@/pages/Main.vue")
            // beforeEnter: requireAuth
        },
        {
            path: "/signin",
            name: "Signin",
            component: () => import("@/pages/Signin.vue"),
            beforeEnter: redirectIfLoggedIn
        },
        {
            path: "/:catchAll(.*)",
            name: "NotFound",
            component: () => import("@/pages/PageNotFound.vue")
        }
    ]
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
    if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
        if (!localStorage.getItem("vuetify:dynamic-reload")) {
            console.log("Reloading page to fix dynamic import error");
            localStorage.setItem("vuetify:dynamic-reload", "true");
            location.assign(to.fullPath);
        } else {
            console.error("Dynamic import error, reloading page did not fix it", err);
        }
    } else {
        console.error(err);
    }
});

router.isReady().then(() => {
    localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;

