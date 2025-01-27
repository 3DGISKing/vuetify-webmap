<template>
    <div>
        <div ref="leafletMapDiv" style="height: 30vh" />
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { MarineApp } from "@/core/MarineApp";

let leafletMapDiv = ref(null);

onMounted(() => {
    const marineApp = inject("marineApp") as MarineApp;
    leafletMapDiv.value.id = "simpleMap-" + marineApp.getMapCount();

    console.log(marineApp);

    const map = L.map(leafletMapDiv.value.id, {
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true
    });

    map.setView([38, -106], 4);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
});
</script>
