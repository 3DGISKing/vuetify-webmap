<template>
    <div>
        <div ref="leafletMapDiv" style="height: 30vh" />
    </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { MarineApp } from "@/core/MarineApp";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { Cartesian3, TileMapServiceImageryProvider, Viewer } from "cesium";

let leafletMapDiv = ref(null);

onMounted(() => {
    const marineApp = inject("marineApp") as MarineApp;

    // @ts-ignore
    leafletMapDiv.value.id = "simpleMap-" + marineApp.getMapCount();

    // @ts-ignore
    const viewer = new Viewer(leafletMapDiv.value.id, {
        baseLayer: false,
        requestRenderMode: true,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        scene3DOnly: true,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        vrButton: false,
        projectionPicker: false,
        shouldAnimate: false
    });

    viewer.camera.setView({
        destination: Cartesian3.fromDegrees(127, 35, 5000000)
    });

    const NaturalEarthIIPromise = TileMapServiceImageryProvider.fromUrl("http://localhost:1217/NaturalEarthII");

    NaturalEarthIIPromise.then((provider: TileMapServiceImageryProvider) => {
        viewer.imageryLayers.addImageryProvider(provider);
    });
});
</script>
