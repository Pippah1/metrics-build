<script setup>
import MemoryUsage from './components/MemoryUsage.vue';
import CpuUsage from './components/CpuUsage.vue';

import { ref, onMounted, onBeforeUnmount } from 'vue';

const webServer = import.meta.env.VITE_WEB_SERVER_NAME || 'unknown';
const result = ref(null);
let intervalId = null;

async function loadMetrics() {
  try {
    const response = await fetch(`/metrics`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    result.value = data;
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

onMounted(() => {
  loadMetrics();
  intervalId = setInterval(loadMetrics, 5000);
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div v-if="result" class="dashboard">
    <h1 class="header">Infrastructure Insight</h1>

    <div class="grid-container">
      <section class="card">
        <h2>{{ result.hostname }} Info</h2>
        <p><strong>Platform:</strong> {{ result.platform }}</p>
        <p><strong>Architecture:</strong> {{ result.arch }}</p>
        <p><strong>Responding web-server:</strong> {{ webServer }}</p>
      </section>

      <section class="card memory">
        <MemoryUsage 
          :total="result.totalMemory" 
          :free="result.freeMemory"
        ></MemoryUsage>
      </section>

      <section class="card cpu">
        <CpuUsage
          :oldCpus="result.cpus[0]"
          :newCpus="result.cpus[1]"
        ></CpuUsage>
      </section>

      <section class="card">
        <h2>Additional Info</h2>
        <p><strong>Cpu:</strong> {{ result.cpus[0][0].model }}</p>
        <p><strong>Uptime:</strong> {{ (result.uptime / 60).toFixed(1) }} Min</p>
      </section>
    </div>
  </div>

  <div v-else class="loading">
    <h1>Loading Ultra Important System Info</h1>
    <div class="loader"></div>
  </div>
</template>

<style>
body {
  background: #f4f7f8;
  font-family: system-ui, sans-serif;
  color: #222;
  background-image: url('./assets/pexels-francesco-ungaro-998641.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.dashboard {
  border: 1px solid #00bcd4;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.4);
  background-color: rgba(20, 20, 20, 0.85);
  max-width: 1250px;
  margin: 20px auto;
}

.header {
  text-align: center;
  color: #ffffff;
  margin-bottom: 30px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.card.memory, .card.cpu {
  grid-column: span 2; /* span 2 columns on large screens */
}

.card {
  background: #e603ad;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #eee;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.card h2 {
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
  color: #00bcd4;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.loading {
  text-align: center;
  font-size: 1em;
  color: #00ff88;
}

.loader {
  margin: auto;
  width: 50%;
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
