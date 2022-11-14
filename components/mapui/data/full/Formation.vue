<template>
  <div class="mb-16 p-2">
    <div class="mb-6 px-5">
      <h1 class="mb-2 text-2xl font-bold">{{ element.Nom }}</h1>
      <h3>{{ element.label || element.Adresse }}</h3>
      <p>{{ element.context }}</p>
      <div class="flex justify-between py-4">
        <a
          v-if="element.Url"
          class="flex gap-4 rounded bg-brand-primary py-2 px-4 text-xl font-semibold text-brand-secondary hover:bg-brand-primary-dark"
          :href="element.Url"
          target="_blank"
          rel="noopener noreferrer"
        >
          Site Web
          <Goarrow class="my-auto" />
        </a>
      </div>

      <div v-if="enumTraces(element).length" class="my-4">
        <div
          v-for="trace in enumTraces(element)"
          :key="trace"
          class="my-3 flex justify-between gap-6"
        >
          <div class="flex gap-4 py-2">
            <img :src="getTraceIcon(trace.type)" />
            <p>{{ getDuration(trace.duration) }}</p>
          </div>

          <a
            class="my-auto cursor-pointer rounded-md bg-brand-primary py-2 px-4 text-brand-secondary hover:bg-brand-primary-dark"
            :href="jobs.getRedictionTrip(trace)"
            target="_blank"
            rel="noopener noreferrer"
          >
            VOIR LE TRAJET
          </a>
        </div>
      </div>

      <div
        v-else
        class="mx-auto my-6 w-1/2 bg-n-gray bg-opacity-30 p-4 text-center text-white"
      >
        <p>Aucun trajet disponible</p>
      </div>
      <p>Contact : {{ element.Telephone }}</p>
    </div>
    <hr class="mx-auto h-1 w-96 bg-gray-light" />
    <div class="mb-6 mt-6 px-5">
      <div class="ml-4 text-xl">
        <h3>Domaine : {{ element.Domaine }}</h3>
      </div>

      <p class="m-4 bg-brand-primary-light p-4">
        {{ element.Mission }}
      </p>
    </div>
  </div>
</template>

<script>
import { useJobsStore } from '@/stores/Jobs.js'

const parseDuration = (duration) => {
  const pattern =
    /^PT(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d{1,3})?)S)?$/
  return pattern.exec(duration)
}
const DurationToText = (duration) => {
  const part = parseDuration(duration)
  return `${part[2] ? part[2] + ' heure(S) ' : ''}${
    part[3] ? part[3] + ' minutes' : ''
  }`
}
export default {
  props: {
    element: { type: Object, default: () => {} },
    home: { type: Object, default: () => {} },
  },
  data() {
    return { jobs: useJobsStore() }
  },
  methods: {
    getTraceIcon(type) {
      return `/assets/vehiclesBlack/${type}.png`
    },
    getDuration(duration) {
      return DurationToText(duration)
    },
    enumTraces(element) {
      return Object.values(element.traces)
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
