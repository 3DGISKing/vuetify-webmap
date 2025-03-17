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
    const extendLeaflet = () => {
        // save these original methods before they are overwritten
        var proto_initIcon = L.Marker.prototype._initIcon;
        var proto_setPos = L.Marker.prototype._setPos;

        var oldIE = L.DomUtil.TRANSFORM === "msTransform";

        L.Marker.addInitHook(function () {
            var iconOptions = this.options.icon && this.options.icon.options;
            var iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
            if (iconAnchor) {
                iconAnchor = iconAnchor[0] + "px " + iconAnchor[1] + "px";
            }
            this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || "center bottom";
            this.options.rotationAngle = this.options.rotationAngle || 0;

            // Ensure marker keeps rotated during dragging
            this.on("drag", function (e) {
                e.target._applyRotation();
            });
        });

        L.Marker.include({
            _initIcon: function () {
                proto_initIcon.call(this);
            },

            _setPos: function (pos) {
                proto_setPos.call(this, pos);
                this._applyRotation();
            },

            _applyRotation: function () {
                if (this.options.rotationAngle) {
                    this._icon.style[L.DomUtil.TRANSFORM + "Origin"] = this.options.rotationOrigin;

                    if (oldIE) {
                        // for IE 9, use the 2D rotation
                        this._icon.style[L.DomUtil.TRANSFORM] = "rotate(" + this.options.rotationAngle + "deg)";
                    } else {
                        // for modern browsers, prefer the 3D accelerated version
                        this._icon.style[L.DomUtil.TRANSFORM] += " rotateZ(" + this.options.rotationAngle + "deg)";
                    }
                }
            },

            setRotationAngle: function (angle) {
                this.options.rotationAngle = angle;
                this.update();
                return this;
            },

            setRotationOrigin: function (origin) {
                this.options.rotationOrigin = origin;
                this.update();
                return this;
            }
        });
    };

    extendLeaflet();

    const map = L.map("contour-map", {
        zoomDelta: 0.1,
        zoomSnap: 0,
        wheelPxPerZoomLevel: 1000,
        zoomControl: true,
        center: [35, 127],
        minZoom: 4,
        maxZoom: 7,
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

    const myIcon = L.icon({
        iconUrl: "http://localhost:3000/icons/leaf-green.png",
        iconSize: [20, 40],
        iconAnchor: [22, 94]
        //popupAnchor: [-3, -76],
        // shadowUrl: "my-icon-shadow.png",
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94]
    });

    L.marker([39, 127], { icon: myIcon, rotationAngle: 45 }).addTo(map);

    setTimeout(() => {
        map.invalidateSize(true);
    }, 0);
});
</script>
