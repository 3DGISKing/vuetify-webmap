// ChildComponent.vue
<template>
    <button @click="emitCustomEvent">Click me to emit event</button>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "ChildComponent",
    emits: ["custom-event"],
    setup(props, { emit }) {
        const emitCustomEvent = () => {
            emit("custom-event", "Hello from child!");
        };

        return {
            emitCustomEvent
        };
    }
});
</script>
