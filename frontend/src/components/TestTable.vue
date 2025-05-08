<template>
    <v-app>
        <v-btn @click="handleClick"> Button </v-btn>
        <v-container id="test-table-container">
            <v-data-table :items="items" style="height: 80vh">
                <template v-slot:item="{ item, index }">
                    <tr :id="`row-${index}`">
                        <td rowspan="2">{{ item.id }}</td>

                        <td class="green">
                            {{ topMessage }} <br />
                            {{ bottomMessage }} <br />
                            {{ topMessage }} <br />
                        </td>
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
import { ref } from "vue";

import { useGoTo } from "vuetify";

const goTo = useGoTo();

const topMessage = ref("top message");
const bottomMessage = ref("bottom message");

const items = [];

for (let i = 0; i < 100; i++) {
    items.push({
        id: i,
        waveHeight: {
            far: 1.3
        },
        waveDirection: {
            near: 1.2,
            far: 1.4
        }
    });
}

function handleClick(event) {
    console.log(1);
    //goTo("#row-9", { container: "#test-table-container" });

    goTo("#row-9", { container: ".v-table__wrapper" });
}
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
