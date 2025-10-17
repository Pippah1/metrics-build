<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  oldCpus: Array,
  newCpus: Array,
});

const cpuRef = ref(null);
let lastUsage = [];

function calculateCpuUsage(oldCpus, newCpus) {
  return oldCpus.map((oldCpu, index) => {
    const newCpu = newCpus[index];
    const oldTotal = Object.values(oldCpu.times).reduce((a, b) => a + b, 0);
    const newTotal = Object.values(newCpu.times).reduce((a, b) => a + b, 0);

    const totalDiff = newTotal - oldTotal;
    const idleDiff = newCpu.times.idle - oldCpu.times.idle;

    return +(((totalDiff - idleDiff) / totalDiff) * 100).toFixed(2);
  });
}

function renderCpuChart() {
  const cpuUsage = calculateCpuUsage(props.oldCpus, props.newCpus);

  // initial render
  if (!lastUsage.length) {
    lastUsage = cpuUsage;

    const trace = {
      x: cpuUsage.map((_, i) => i + 1),
      y: cpuUsage,
      type: 'bar',
      marker: { color: '#3B1EFA', line: { width: 1, color: '#333' } },
      width: 0.4,
      hovertemplate: 'Core %{x}: %{y}%<extra></extra>',
    };

    const layout = {
      title: { text: 'CPU Usage per Logical Processor (%)', font: { size: 16 } },
      xaxis: { title: 'Core', tickmode: 'linear' },
      yaxis: { title: 'Usage (%)', range: [0, 100] },
      margin: { t: 30, b: 30, l: 40, r: 20 },
      plot_bgcolor: '#1e1e1e',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#eee', family: 'system-ui, sans-serif' },
    };

    Plotly.newPlot(cpuRef.value, [trace], layout, { responsive: true });
    return;
  }

  Plotly.animate(
    cpuRef.value,
    {
      data: [{ y: cpuUsage }],
      traces: [0],
      layout: {},
    },
    {
      transition: { duration: 800, easing: 'cubic-in-out' },
      frame: { duration: 800, redraw: false },
    }
  );

  lastUsage = cpuUsage;
}

onMounted(renderCpuChart);
watch(props, renderCpuChart, { deep: true });
</script>

<template>
  <div ref="cpuRef" style="width: 100%; height: 300px;"></div>
</template>
