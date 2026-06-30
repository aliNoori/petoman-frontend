// vite.config.ts
import { defineConfig } from "file:///C:/Users/School/Desktop/FrontendFramework/nuxtjs/projects/PetomanFront/node_modules/.pnpm/vite@5.4.21_@types+node@20._19689f3bde7ce32e8bd92b07b9a002cb/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/School/Desktop/FrontendFramework/nuxtjs/projects/PetomanFront/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_ece82a2fe169dcbd69a206b96c22223a/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///C:/Users/School/Desktop/FrontendFramework/nuxtjs/projects/PetomanFront/node_modules/.pnpm/vite-plugin-dts@3.9.1_@type_aa6fa8eab06807ebd0b5e81a9eb8abd8/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\School\\Desktop\\FrontendFramework\\nuxtjs\\projects\\PetomanFront\\packages\\ui";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "@petoman/ui",
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: {
      external: process.env.NODE_ENV === "production" ? ["vue"] : [],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTY2hvb2xcXFxcRGVza3RvcFxcXFxGcm9udGVuZEZyYW1ld29ya1xcXFxudXh0anNcXFxccHJvamVjdHNcXFxcUGV0b21hbkZyb250XFxcXHBhY2thZ2VzXFxcXHVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTY2hvb2xcXFxcRGVza3RvcFxcXFxGcm9udGVuZEZyYW1ld29ya1xcXFxudXh0anNcXFxccHJvamVjdHNcXFxcUGV0b21hbkZyb250XFxcXHBhY2thZ2VzXFxcXHVpXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9TY2hvb2wvRGVza3RvcC9Gcm9udGVuZEZyYW1ld29yay9udXh0anMvcHJvamVjdHMvUGV0b21hbkZyb250L3BhY2thZ2VzL3VpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICBkdHMoe1xyXG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgbGliOiB7XHJcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxyXG4gICAgICBuYW1lOiAnQHBldG9tYW4vdWknLFxyXG4gICAgICBmaWxlTmFtZTogJ2luZGV4JyxcclxuICAgICAgZm9ybWF0czogWydlcyddLFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyBbJ3Z1ZSddIDogW10sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHZ1ZTogJ1Z1ZScsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQTRiLFNBQVMsb0JBQW9CO0FBQ3pkLE9BQU8sU0FBUztBQUNoQixPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBSHhCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxNQUNGLGtCQUFrQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFNBQVMsQ0FBQyxJQUFJO0FBQUEsSUFDaEI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsUUFBUSxJQUFJLGFBQWEsZUFBZSxDQUFDLEtBQUssSUFBSSxDQUFDO0FBQUEsTUFDN0QsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
