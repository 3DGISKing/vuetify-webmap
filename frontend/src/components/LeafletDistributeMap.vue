<script setup lang="ts">
import MapList from "./MapList.vue";
import VerticalToolbar from "./VerticalToolbar.vue";
</script>

<template>
    <v-container id="distribute-map-root" class="root">
        <v-row>
            <v-col cols="11">
                <LeafletMapList />
            </v-col>

            <v-col align="center" cols="1">
                <VerticalToolbar></VerticalToolbar>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
#distribute-map-root {
    max-width: 100vw !important;
}
</style>
