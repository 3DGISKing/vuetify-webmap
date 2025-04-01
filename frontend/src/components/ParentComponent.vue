// ParentComponent.vue
<template>
    <ChildComponent @custom-event="handleCustomEvent" />
    <p>Message from child: {{ message }}</p>
</template>

<script>
import { defineComponent, ref } from "vue";
import ChildComponent from "./ChildComponent.vue";

export default defineComponent({
    name: "ParentComponent",
    components: {
        ChildComponent
    },
    setup() {
        const message = ref("");

        const handleCustomEvent = (payload) => {
            message.value = payload;
        };

        return {
            message,
            handleCustomEvent
        };
    }
});
</script>
