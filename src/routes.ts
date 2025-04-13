export const routes = {
  "/home/": {
    "filePath": "src\\pages\\home\\page.tsx",
    "isSSR": true
  },
  "/home/profile/": {
    "filePath": "src\\pages\\home\\profile\\page.tsx",
    "isSSR": false
  },
  "/login/": {
    "filePath": "src\\pages\\login\\page.tsx",
    "isSSR": false
  },
  "/": {
    "filePath": "src\\pages\\page.tsx",
    "isSSR": false
  },
  "/post/": {
    "filePath": "src\\pages\\post\\page.tsx",
    "isSSR": false
  },
  "/post/[postId]/": {
    "filePath": "src\\pages\\post\\[postId]\\page.tsx",
    "isSSR": true
  },
  "/register/": {
    "filePath": "src\\pages\\register\\page.tsx",
    "isSSR": false
  }
}