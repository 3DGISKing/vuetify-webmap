<template>
    <div>
        <div id="map" style="height: 90vh" />
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted } from "vue";
import * as turf from "@turf/turf";

import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import parse_georaster from "georaster";
import { convertLength } from "@turf/helpers";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import * as fixture from "./switzerland.json";

import rasterize from "../core/rasterize/main";

onMounted(() => {
    const map = L.map("map", {
        attributionControl: true,
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true
    });

    const layer = L.geoJSON(fixture).addTo(map);
    map.fitBounds(layer.getBounds());

    const pixelSizeInMetres = 1000;
    console.time("rasterize");
    const grid = rasterize(fixture, {
        pixelSizeMeters: pixelSizeInMetres
    });
    console.timeEnd("rasterize");

    const noDataValue = 0;
    const projection = 4326;

    const xmin = grid.bbox[0];
    const ymax = grid.bbox[3];
    const pixelSizeInDegrees = convertLength(pixelSizeInMetres, "metres", "degrees");
    const pixelWidth = pixelSizeInDegrees;
    const pixelHeight = pixelSizeInDegrees;
    const metadata = { noDataValue, projection, xmin, ymax, pixelWidth, pixelHeight };

    parse_georaster([grid.grid], metadata).then((georaster) => {
        console.log("georaster:", georaster);
        var layer2 = new GeoRasterLayer({
            georaster: georaster,
            opacity: 0.7,
            pixelValuesToColorFn: (values) => (values[0] === 0 ? "red" : "#0000ff")
        });
        layer2.addTo(map);
    });
});
</script>
