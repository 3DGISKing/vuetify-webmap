<template>
    <div>
        <div id="contour-map" style="height: 90vh" />
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

import { MarineApp } from "@/core/MarineApp";

onMounted(() => {
    const map = L.map("contour-map", {
        zoomControl: true,
        center: [35, 127],
        zoom: 4,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true
    });

    const googleSat = L.tileLayer("http://localhost:1217/GoogleSatTMS/lyrss&x{x}&y{y}&z{z}.jpg", {
        maxZoom: 20
    });

    googleSat.addTo(map);

    const marineApp = inject("marineApp") as MarineApp;

    const data = marineApp.getWaveHeightData();
    const contourGenerator = marineApp.contourGenerator;

    const contour = contourGenerator.createContours(data, {
        thresholds: 50
    });

    const features = contour.features;
    const min = features[0].properties.value;
    const max = features[features.length - 1].properties.value;

    features.forEach((feature) => {
        const myStyle = {
            color: contourGenerator.getColor(feature.properties.value, min, max),
            opacity: 1,
            weight: 2,
            fillOpacity: 0
        };

        L.geoJSON(feature, {
            style: myStyle
        }).addTo(map);
    });

    setTimeout(() => {
        map.invalidateSize(true);
    }, 0);
});
</script>
