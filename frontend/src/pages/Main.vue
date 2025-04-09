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
            <v-tab value="leafletDistributeMap"> Leaflet Distribute Map </v-tab>
            <v-tab value="cesiumDistributeMap"> Cesium Distribute Map </v-tab>
            <v-tab value="table"> Table </v-tab>
            <v-tab value="editor"> Editor </v-tab>
            <v-tab value="chart"> Pie Chart </v-tab>
            <v-tab value="barchart"> Bar Chart </v-tab>
            <v-tab value="eventTest1"> Event Test1 </v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="tab-window-root">
            <v-tabs-window-item value="leafletMap">
                <LeafletMap />
            </v-tabs-window-item>
            <v-tabs-window-item value="contourMap">
                <ContourMap />
            </v-tabs-window-item>
            <v-tabs-window-item value="leafletDistributeMap">
                <LeafletDistributeMap />
            </v-tabs-window-item>
            <v-tabs-window-item value="cesiumDistributeMap">
                <CesiumDistributeMap />
            </v-tabs-window-item>
            <v-tabs-window-item value="table">
                <TestTable />
            </v-tabs-window-item>
            <v-tabs-window-item value="editor">
                <Editor />
            </v-tabs-window-item>
            <v-tabs-window-item value="chart">
                <Chart />
            </v-tabs-window-item>
            <v-tabs-window-item value="barchart">
                <BarChart />
            </v-tabs-window-item>
            <v-tabs-window-item value="eventTest1">
                <EventTest1 />
            </v-tabs-window-item>
        </v-tabs-window>
    </v-card>
</template>

<script lang="ts">
import Editor from "@/components/Editor.vue";
import EventTest1 from "@/components/EventTest1.vue";

export default {
    data: () => ({
        tab: "barchart"
    }),
    methods: {}
};
</script>

<style scoped>
.tab-window-root {
    height: calc(100% - 112px); /* 64px + 48px header height + tab header height */
}
</style>
