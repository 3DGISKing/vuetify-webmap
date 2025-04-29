<template>
    <div>
        <div id="simplifymap" style="height: 90vh" />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import * as turf from "@turf/turf";

import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import * as islands from "./islands.json";

onMounted(() => {
    const map = L.map("simplifymap", {
        attributionControl: true,
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true
    });

    map.setView([39.49, 123.074], 14);

    const features = islands.features;

    L.geoJSON(features, {
        style: {
            color: "#0000FF",
            fillOpacity: 0,
            weight: 1
        }
    }).addTo(map);

    function simplifySmoothTest(feature: any, tolerance: number, smoothIteration: number) {
        const polygon = turf.polygon(feature.geometry.coordinates[0]);

        const options = { tolerance: tolerance, highQuality: true };

        const simplifiedFeature = turf.simplify(polygon, options);

        L.geoJSON(simplifiedFeature, {
            style: {
                color: "#FFFF00",
                fillOpacity: 0,
                weight: 5
            }
        }).addTo(map);

        const simplifiedPolygon = turf.polygon(simplifiedFeature.geometry.coordinates);

        const smoothPolygon = turf.polygonSmooth(simplifiedPolygon, { iterations: smoothIteration });

        L.geoJSON(smoothPolygon, {
            style: {
                color: "#FF0000",
                fillOpacity: 0,
                weight: 5
            }
        }).addTo(map);
    }

    simplifySmoothTest(features[0], 0.001, 3);
    simplifySmoothTest(features[1], 0.001, 3);
    simplifySmoothTest(features[2], 0.0001, 5);

    setTimeout(() => {
        map.invalidateSize(true);
    }, 0);
});
</script>
