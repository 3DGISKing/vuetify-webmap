<template>
    <div>
        <div id="contour-map" style="height: 90vh" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

onMounted(() => {
    const map = L.map("contour-map", {
        zoomControl: true,
        zoom: 4,
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
