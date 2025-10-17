<script setup>
import { ref, onMounted, watch } from 'vue';
import Plotly from 'plotly.js-dist';

const memInfo = defineProps({
  total: Number,
  free: Number,
});

let lastUsage = null;

const memoryRef = ref(null);

let totalToGb = 0;
let freeToGb = 0;

function calculateMemoryUsage(total, free) {
    totalToGb = +(total / 1073741824).toFixed(2);
    freeToGb = +(free / 1073741824).toFixed(2);

    return totalToGb - freeToGb;
}

function renderMemoryGauge() {
    const memoryUsage = calculateMemoryUsage(memInfo.total, memInfo.free);

    if (lastUsage === null) {
        lastUsage = memoryUsage;

        const data = [{
            type: "indicator",
            mode: "gauge+number+delta",
            value: memoryUsage,
            title: { text: "Memory Usage (GB)", font: { size: 24 } },
            delta: { reference: totalToGb, increasing: { color: "red" }, decreasing: { color: "green" } },
            gauge: {
                axis: { range: [0, totalToGb] },
                bar: { color: "#26961A" },
                steps: [
                    { range: [0, totalToGb * 0.5], color: "#a5d6a7" },
                    { range: [totalToGb * 0.5, totalToGb * 0.8], color: "#ffeb3b" },
                    { range: [totalToGb * 0.8, totalToGb], color: "#f44336" }
                ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: totalToGb * 0.9
                }
            }
        }];

        const layout = { 
            autosize: true,
            margin: { t: 50, b: 0, l: 50, r: 50 },
            plot_bgcolor: '#1e1e1e',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#eee', family: 'system-ui, sans-serif' }
        };

        Plotly.newPlot(memoryRef.value, data, layout , { responsive: true });
    }

    Plotly.animate(
        memoryRef.value,
        {
            data: [{ value: memoryUsage }],
            traces: [0],
            layout: {},
        },
        {
            transition: { duration: 800, easing: 'cubic-in-out' },
            frame: { duration: 800, redraw: false },
        }
    );

    lastUsage = memoryUsage;
}

onMounted(renderMemoryGauge);
watch(memInfo, renderMemoryGauge, { deep: true });
</script>

<template>
    <div ref="memoryRef" style="width: 100%; height: 300px;"></div>
</template>
