<template>
  <div class="my-auto ml-4 flex rounded-full bg-gray-light">
    <p class="my-auto pr-2 pl-4 text-2xl text-brand-secondary">
      Distance (km) :
    </p>
    <input
      v-model="jobs.distance"
      class="w-16 rounded-full bg-brand-primary py-3 px-4 text-2xl text-brand-secondary"
      type="number"
      max="99"
    />
  </div>
</template>

<script>
import { useJobsStore } from '../../stores/Jobs.js'

export default {
  data() {
    return {
      jobs: useJobsStore(),
    }
  },
  mounted() {
    watch(
      () => this.jobs.distance,
      (n) => {
        if (n > 0) {
          this.jobs.filtersUpdated = true
        }
      }
    )
  },
}
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>

<style scoped>
* {
  transition: 0.2s;
}
</style>
