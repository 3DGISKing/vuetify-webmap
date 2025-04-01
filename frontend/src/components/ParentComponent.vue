// ParentComponent.vue
<template>
    <ChildComponent @custom-event="handleCustomEvent" />
    <p>Message from child: {{ message }}</p>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import ChildComponent from "./ChildComponent.vue";
import { emitter } from "../composables/useEvent";

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

        onMounted(() => {
            emitter.on("MyEvent", (data) => {
                alert(`MyEvent: ${JSON.stringify(data)}`);
            });
        });

        return {
            message,
            handleCustomEvent
        };
    }
});
</script>
