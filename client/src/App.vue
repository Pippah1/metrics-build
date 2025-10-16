<script setup>
// import HelloWorld from './components/HelloWorld.vue'

import { ref, onMounted } from 'vue';

const result = ref(null);

async function loadMetrics() {
  try {
    const response = await fetch('http://localhost:3000/metrics');

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    result.value = data;
    console.log(result)
  } catch (error) {
    console.error(error.message);
  }
}

onMounted(() => {
  loadMetrics()
});
</script>

<template>
  <div>
    <pre>{{ result }}</pre>
  </div>

  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style>

</style>
