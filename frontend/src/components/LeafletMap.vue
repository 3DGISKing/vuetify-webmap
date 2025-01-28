<template>
    <div>
        <div id="map" style="height: 90vh" />
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-measure";
import "leaflet-measure/dist/leaflet-measure.css";
import { MarineApp } from "@/core/MarineApp";

import * as USA from "./USA.json";

const initialMap = ref(null);

onMounted(() => {
    const map = L.map("map", {
        attributionControl: true,
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true
    });

    map.setView([35, 127], 5);
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    const drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);
    const options = {
        position: "topright"
    };
    const measureControl = new L.Control.Measure(options);
    measureControl.addTo(map);
    initialMap.value = map;

    const googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
    });

    googleSat.addTo(map);

    /*
    L.geoJSON(USA.features).addTo(map);
    L.marker([39, 127]).addTo(map);

    const polygon = L.polygon([
        [38, -106],
        [38, -107],
        [40, -108]
    ]).addTo(map);

    polygon.setStyle({ fillColor: "#FFFF00" });
    */
});
</script>
