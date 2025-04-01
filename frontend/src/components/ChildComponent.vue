// ChildComponent.vue

<template>
    <button @click="emitCustomEvent">Click me to emit event</button>
</template>

<script>
import { defineComponent } from "vue";
import { emitter } from "../composables/useEvent";

export default defineComponent({
    name: "ChildComponent",
    emits: ["custom-event"],
    setup(props, { emit }) {
        const emitCustomEvent = () => {
            emit("custom-event", "Hello from child!");

            emitter.emit("MyEvent", { data: 1 });
        };

        return {
            emitCustomEvent
        };
    }
});
</script>
