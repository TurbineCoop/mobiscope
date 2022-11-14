<template>
  <div class="z-1000 absolute bottom-10 left-10 flex">
    <div class="flex divide-x divide-n-gray">
      <div v-for="(btn, i) in vehicles" :key="btn">
        <button
          v-if="withVehicles[btn]"
          class="h-16 py-2 px-6 ring-2 ring-brand-primary hover:bg-brand-primary-dark"
          :class="[
            jobs.isoToDisplay === btn
              ? 'bg-brand-primary'
              : 'bg-brand-secondary',
            i == 0
              ? vehicles.length === 1
                ? 'rounded-full'
                : 'rounded-l-full'
              : i == vehicles.length - 1
              ? 'rounded-r-full'
              : '',
          ]"
          @click="$emit('toggleIso', btn)"
        >
          <img
            :src="`/assets/${
              btn === jobs.isoToDisplay ? 'vehicles' : 'vehiclesBlack'
            }/${btn}.png`"
          />
        </button>
      </div>
    </div>
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
  computed: {
    withVehicles() {
      return this.jobs.terms.withVehicles
    },
    vehicles() {
      const res = []
      Object.keys(this.withVehicles).forEach((e) => {
        if (this.withVehicles[e]) res.push(e)
      })
      return res
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
