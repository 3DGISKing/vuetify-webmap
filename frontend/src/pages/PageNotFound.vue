<template>
    <v-empty-state
        action-text="Retry Request"
        image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/connection.svg"
        text="There might be a problem with your connection or our servers. Please check your internet connection or try again later. We appreciate your patience."
        title="Something Went Wrong"
        @click:action="onClickAction"
    />
</template>

<script lang="ts">
export default {
    methods: {
        onClickAction() {
            alert("You clicked the action button");
        }
    }
};
</script>
