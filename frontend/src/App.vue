<template>
    <v-app>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>
import { provide } from "vue";
import { getMarineApp } from "./core/MarineApp";

const marineApp = getMarineApp();

provide("marineApp", marineApp);
</script>

