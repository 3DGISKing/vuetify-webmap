<template>
    <v-container id="maplist-root" fluid>
        <v-row>
            <v-col v-for="i in 12" :key="i" cols="4">
                <SimpleMap></SimpleMap>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
#maplist-root {
    height: calc(100vh - 144px); /* 64 + 48 + 16 + 16  */
    overflow-y: scroll;
}
</style>
