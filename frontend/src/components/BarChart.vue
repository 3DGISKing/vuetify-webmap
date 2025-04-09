<template>
    <v-chart class="barchart" :option="option" />
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import VChart from "vue-echarts";
import { ref } from "vue";

use([BarChart, CanvasRenderer, GridComponent]);

const option = ref({
    xAxis: {
        type: "category",
        data: [1, 2, 3, 4, 5, 6, 7]
    },
    yAxis: {
        type: "value"
    },
    series: [
        {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar"
        }
    ]
});
</script>

<style scoped>
.barchart {
    height: 500px;
}
</style>
