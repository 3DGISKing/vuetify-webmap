// Plugins
import Components from "unplugin-vue-components/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import ViteFonts from "unplugin-fonts/vite";
import VueRouter from "unplugin-vue-router/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const cesiumSource = "node_modules/cesium/Build/Cesium";
// This is the base url for static files that CesiumJS needs to load.
// Set to an empty string to place the files at the site's root path
const cesiumBaseUrl = "cesiumStatic";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VueRouter(),
        Vue({
            template: {
                transformAssetUrls,
                compilerOptions: {
                    isCustomElement: (tag) => ["H1"].includes(tag)
                }
            }
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
        Vuetify({
            autoImport: true,
            styles: {
                configFile: "src/styles/settings.scss"
            }
        }),
        Components(),
        ViteFonts({
            google: {
                families: [
                    {
                        name: "Roboto",
                        styles: "wght@100;300;400;500;700;900"
                    }
                ]
            }
        }),
        // Copy Cesium Assets, Widgets, and Workers to a static directory.
        // If you need to add your own static files to your project, use the `public` directory
        // and other options listed here: https://vitejs.dev/guide/assets.html#the-public-directory
        viteStaticCopy({
            targets: [
                { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
                { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
                { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
                { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl }
            ]
        })
    ],
    define: {
        "process.env": {},
        // Define relative base path in cesium for loading assets
        // https://vitejs.dev/config/shared-options.html#define
        CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`)
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        },
        extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
    },
    server: {
        port: 3000
    },
    css: {
        preprocessorOptions: {
            sass: {
                api: "modern-compiler"
            }
        }
    }
});

