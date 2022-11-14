<template>
  <div class="my-auto h-1/3 rounded-xl bg-brand-secondary">
    <div
      class="flex cursor-pointer justify-end pr-3 pt-3"
      @click="$emit('close')"
    >
      <CrossBlack />
    </div>

    <h2 class="py-4 px-10 text-2xl font-bold">
      {{ getContext }} ne correspond à vos critères de recherche.
    </h2>
    <div class="flex justify-center px-4 pb-8">
      <select
        v-model="activitySector"
        required
        class="mx-4 my-auto h-10 rounded p-2 text-lg ring-2 ring-brand-primary"
      >
        <option value="">Domaine d'activité</option>
        <option v-for="s in sectors" :key="s" :value="s">
          {{ s }}
        </option>
      </select>
      <button
        v-if="activitySector"
        class="my-auto rounded bg-brand-primary py-2 px-4 text-xl text-brand-secondary hover:bg-brand-primary-dark"
        @click="research"
      >
        Rechercher
      </button>
    </div>
  </div>
</template>

<script>
import CrossBlack from '../assets/CrossBlack.svg'
import { useJobsStore } from '@/stores/Jobs'
export default {
  components: { CrossBlack },
  data() {
    return {
      loading: false,
      jobs: useJobsStore(),
      sectors: Object.keys(useJobsStore().sectors),
      activitySector: '',
      activitySectorName: '',
    }
  },
  computed: {
    getContext() {
      return {
        'Un emploi': "Aucune offre d'emploi ",
        'Une formation': 'Aucune formation ',
        'Une SIAE': 'Aucune SIAE ',
        'Une entreprise active': 'Aucune entreprise',
      }[this.jobs.terms.searchType]
    },
  },
  methods: {
    research() {
      this.jobs.terms.activitySectorName = this.activitySector
      this.jobs.terms.activitySector = this.jobs.sectors[this.activitySector]
      this.loading = true
      this.$emit('search')
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
