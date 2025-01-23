import { Router } from "vue-router";
import Store from "./plugins/store";

declare module "*.vue" {
    import { defineComponent } from "vue";
    export default defineComponent;
}

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $store: Store;
        $router: Router;
    }
}
