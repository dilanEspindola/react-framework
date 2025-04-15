export const routes = {
            "/home/": {
                  filePath: "src/pages/home/page.tsx",
                  isSSR: false,
                  path: "home",
                  component: () => import("./pages/home/page.tsx")
                },
"/home/profile/": {
                  filePath: "src/pages/home/profile/page.tsx",
                  isSSR: false,
                  path: "home/profile",
                  component: () => import("./pages/home/profile/page.tsx")
                },
"/login/": {
                  filePath: "src/pages/login/page.tsx",
                  isSSR: false,
                  path: "login",
                  component: () => import("./pages/login/page.tsx")
                },
"/": {
                  filePath: "src/pages/page.tsx",
                  isSSR: false,
                  path: "/",
                  component: () => import("./pages/page.tsx")
                },
"/post/": {
                  filePath: "src/pages/post/page.tsx",
                  isSSR: false,
                  path: "post",
                  component: () => import("./pages/post/page.tsx")
                },
"/post/[postId]/": {
                  filePath: "src/pages/post/[postId]/page.tsx",
                  isSSR: true,
                  path: "post/[postId]",
                  component: () => import("./pages/post/[postId]/page.tsx")
                },
"/register/": {
                  filePath: "src/pages/register/page.tsx",
                  isSSR: false,
                  path: "register",
                  component: () => import("./pages/register/page.tsx")
                }
        };