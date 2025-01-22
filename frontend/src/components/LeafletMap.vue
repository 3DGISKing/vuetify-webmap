<template>
  <div>
    <div
      id="map"
      style="height: 90vh"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-measure";
import "leaflet-measure/dist/leaflet-measure.css";

import * as USA from "./USA.json";

const initialMap = ref(null);

onMounted(() => {
    const map = L.map("map", {
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true
    });

    map.setView([38, -106], 4);

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

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.geoJSON(USA.features).addTo(map);

    L.marker([38, -106]).addTo(map);

    const polygon = L.polygon([
        [38, -106],
        [38, -107],
        [40, -108]
    ]).addTo(map);

    polygon.setStyle({ fillColor: "#FFFF00" });

    // initialMap.value.addLayer(markers);
});
</script>
