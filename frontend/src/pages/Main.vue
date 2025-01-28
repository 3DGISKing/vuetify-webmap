<template>
    <v-card>
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

        <v-tabs v-model="tab" vertical>
            <v-tab text="Leaflet Map" value="leafletMap">
                <v-icon left> mdi-account </v-icon>
                Leaflet Map
            </v-tab>

            <v-tab value="contourMap">
                <v-icon left> mdi-lock </v-icon>
                ContourMap
            </v-tab>

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

// import ContourMap from '@/components/ContourMap.vue';

export default {
    data: () => ({
        tab: "leafletMap"
    }),
    methods: {}
};
</script>

<style scoped>
.tab-window-root {
    height: 700px;
}
</style>
