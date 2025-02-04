<template>
    <v-app>
        <v-container>
            <v-data-table :items="items">
                <template v-slot:item="{ item, index }">
                    <tr>
                        <td rowspan="2">{{ item.id }}</td>

                        <td class="green">{{ item.waveHeight.near }}</td>
                        <td class="green">{{ item.waveDirection.near }}</td>
                    </tr>
                    <tr>
                        <td>{{ item.waveHeight.far }}</td>
                        <td>{{ item.waveDirection.far }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-container>
    </v-app>
</template>
<script setup>
const items = [
    {
        id: 1,
        waveHeight: {
            near: 1.1,
            far: 1.3
        },
        waveDirection: {
            near: 1.2,
            far: 1.4
        }
    },
    {
        id: 2,
        waveHeight: {
            near: 2.1,
            far: 2.3
        },
        waveDirection: {
            near: 2.2,
            far: 2.4
        }
    }
];
</script>

<style scoped>
table,
th,
td {
    border: 1px solid black;
    border-collapse: collapse;
}

td {
    border: 1px solid black;
    padding: 8px;
}

.green {
    background-color: green;
}
</style>
