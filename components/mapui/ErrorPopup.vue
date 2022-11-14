<template>
  <div class="my-auto h-1/3 rounded-xl bg-brand-secondary">
    <div
      class="flex cursor-pointer justify-end pr-3 pt-3"
      @click="$emit('close')"
    >
      <CrossBlack />
    </div>

    <h2 class="mb-6 flex justify-center py-4 px-10 text-2xl font-bold">
      {{ getContext }}
    </h2>
    <h2 class="mb-6 flex justify-center py-4 px-10 text-2xl">
      {{ msg }}
    </h2>
    <div
      v-if="['SECTOREMPTY', 'NOSECTOR'].includes(error)"
      class="flex justify-center px-4 pb-8"
    >
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
        :class="
          activitySector
            ? 'bg-brand-primary hover:bg-brand-primary-dark'
            : 'cursor-not-allowed bg-gray-light'
        "
        class="my-auto rounded py-2 px-4 text-xl text-brand-secondary"
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
  props: {
    error: { type: String, default: '' },
    msg: { type: String, default: '' },
  },
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
        MERGEFAILED:
          'La colorisation des points est indisponible pour le moment.',
        CATCHED: 'Une erreur est survenue.',
        POINTSEND:
          "Ce point ou votre domicile est inaccessible ou en dehors du département de l'Isère.",
        NOSECTOR: "Veuillez renseigner un secteur d'activité",
        SECTOREMPTY:
          {
            'Un emploi': "Aucune offre d'emploi ",
            'Une formation': 'Aucune formation ',
            'Une SIAE': 'Aucune SIAE ',
            'Une entreprise active': 'Aucune entreprise',
          }[this.jobs.terms.searchType] +
          ` ne correspond à vos critères de recherche.`,
      }[this.error]
    },
  },
  methods: {
    research() {
      if (!this.activitySector) return
      this.loading = true
      this.jobs.terms.activitySectorName = this.activitySector
      this.jobs.terms.activitySector = this.jobs.sectors[this.activitySector]
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
