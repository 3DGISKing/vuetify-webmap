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

    const map = L.map(leafletMapDiv.value.id, {
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true
    });

    map.setView([35, 127], 4);

    const googleSat = L.tileLayer("http://localhost:1217/GoogleSatTMS/lyrss&x{x}&y{y}&z{z}.jpg", {
        maxZoom: 20
    });

    googleSat.addTo(map);

    setTimeout(() => {
        map.invalidateSize(true);
    }, 100);
});
</script>
