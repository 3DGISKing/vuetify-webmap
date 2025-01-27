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

            <v-tab value="table">
                <v-icon left> mdi-lock </v-icon>
                Table
            </v-tab>

            <v-tab>
                <v-icon left> mdi-lock </v-icon>
                Option 2
            </v-tab>
            <v-tab value="mapList"> MapList </v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="leafletMap">
                <LeafletMap />
            </v-tabs-window-item>
            <v-tabs-window-item value="table">
                <TestTable />
            </v-tabs-window-item>
            <v-tabs-window-item value="mapList">
                <MapList />
            </v-tabs-window-item>
        </v-tabs-window>
    </v-card>
</template>

<script lang="ts">
import MapList from "@/components/MapList.vue";

// import ContourMap from '@/components/ContourMap.vue';

export default {
    data: () => ({
        tab: "leafletMap"
    }),
    methods: {}
};
</script>
