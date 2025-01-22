/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import App from "./App.vue";
import { createApp } from "vue";
import { MarineApp } from "./core/MarineApp";

export default function main() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const marineApp = new MarineApp();

    const app = createApp(App);

    registerPlugins(app);

    app.mount("#app");
}

