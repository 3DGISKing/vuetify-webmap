<template>
    <v-card height="100vh" id="main-root">
        <v-toolbar color="cyan" dark flat>
            <v-app-bar-nav-icon />

            <v-toolbar-title>Your Dashboard</v-toolbar-title>

            <v-spacer />

            <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </v-toolbar>

        <v-tabs v-model="tab">
            <v-tab value="leafletMap"> Leaflet Map </v-tab>
            <v-tab value="contourMap"> ContourMap </v-tab>
            <v-tab value="verticalToolbar"> Vertical Toolbar </v-tab>
            <v-tab value="mapList"> MapList </v-tab>
            <v-tab value="distributeMap"> Distribute Map </v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="tab-window-root">
            <v-tabs-window-item value="leafletMap">
                <LeafletMap />
            </v-tabs-window-item>
            <v-tabs-window-item value="contourMap">
                <ContourMap />
            </v-tabs-window-item>
            <v-tabs-window-item value="verticalToolbar">
                <VerticalToolbar />
            </v-tabs-window-item>
            <v-tabs-window-item value="mapList">
                <MapList />
            </v-tabs-window-item>
            <v-tabs-window-item value="distributeMap">
                <DistributeMap />
            </v-tabs-window-item>
        </v-tabs-window>
    </v-card>
</template>

<script lang="ts">
import ContourMap from "@/components/ContourMap.vue";
import DistributeMap from "@/components/DistributeMap.vue";
import MapList from "@/components/MapList.vue";
import VerticalToolbar from "@/components/VerticalToolbar.vue";

export default {
    data: () => ({
        tab: "leafletMap"
    }),
    methods: {}
};
</script>

<style scoped>
.tab-window-root {
    height: calc(100% - 112px); /* 64px + 48px header height + tab header height */
}
</style>
