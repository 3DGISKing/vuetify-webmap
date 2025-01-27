<script setup lang="ts">
import MapList from "./MapList.vue";
import VerticalToolbar from "./VerticalToolbar.vue";
</script>

<template>
    <v-container id="qqqq" class="root">
        <v-row>
            <v-col cols="11">
                <MapList />
            </v-col>

            <v-col cols="1">
                <VerticalToolbar></VerticalToolbar>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.root {
    height: 100%;
    overflow-y: auto;
}
</style>
