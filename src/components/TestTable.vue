<template>
    <v-data-table :items="items"></v-data-table>
</template>

<script setup lang="ts">
const items = [
    {
        name: "African Elephant",
        species: "Loxodonta africana",
        diet: "Herbivore",
        habitat: "Savanna, Forests"
    }
    // ... more items
];
</script>

<style scoped>
table,
th,
td {
    border: 1px solid black;
    border-collapse: collapse;
}
</style>
