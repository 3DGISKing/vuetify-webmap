/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

import { MarineApp } from "./core/MarineApp";

function createMarineApp() {}

export default function main() {
    const marineApp = new MarineApp();

    const app = createApp(App);

    registerPlugins(app);

    app.mount("#app");
}

