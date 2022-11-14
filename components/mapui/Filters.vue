<template>
  <div class="ml-2 flex">
    <div class="flex divide-x">
      <button
        v-for="btn in l"
        :key="btn"
        class="mx-1 rounded-full py-2 px-5 hover:bg-brand-primary-dark hover:ring-0"
        :class="[
          withVehicles[btn] ? 'bg-brand-primary' : 'ring-2 ring-brand-primary',
        ]"
        @click="toggle(btn)"
      >
        <img
          :src="`/assets/${
            withVehicles[btn] ? 'vehicles' : 'vehiclesBlack'
          }/${btn}.png`"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { useJobsStore } from '../../stores/Jobs.js'

export default {
  data() {
    return {
      l: [
        'transports',
        'pedestrian',
        'carOrBike',
        'carpooling',
        'bicycle',
        'elecBicycle',
        'scooter',
      ],
      jobs: useJobsStore(),
    }
  },
  computed: {
    withVehicles() {
      return this.jobs.terms.withVehicles
    },
  },
  mounted() {
    this.jobs.resetVehicles()
  },
  methods: {
    toggle(opt) {
      this.jobs.toggleVehicle(opt)
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
