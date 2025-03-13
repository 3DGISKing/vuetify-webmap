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

    map.createPane("contour");

    // This pane is above markers but below popups
    map.getPane("contour").style.zIndex = 399;

    const googleSat = L.tileLayer("http://localhost:3000/data/GoogleSatTMS/lyrss&x{x}&y{y}&z{z}.jpg", {
        maxZoom: 20
    });

    // googleSat.addTo(map);

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
            style: myStyle,
            pane: "contour"
        }).addTo(map);
    });

    const latLngBounds = L.latLngBounds([
        [-90, -180],
        [90, 180]
    ]);

    const imageOverlay = L.imageOverlay("http://localhost:3000/data/GoogleSatTMS/lyrss&x0&y0&z0.jpg", latLngBounds, {
        opacity: 0.8,
        // errorOverlayUrl: errorOverlayUrl,
        alt: "World",
        interactive: true
    }).addTo(map);

    setTimeout(() => {
        map.invalidateSize(true);
    }, 0);
});
</script>
