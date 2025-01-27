<template>
    <v-container fluid>
        <v-row>
            <v-col v-for="i in 12" :key="i" cols="4">
                <SimpleMap></SimpleMap>
            </v-col>
        </v-row>
    </v-container>
</template>
