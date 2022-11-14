<template>
  <div class="mb-16 p-2">
    <div class="mb-6 px-5">
      <h1 class="mb-2 text-2xl font-bold">{{ siae.enseigne }}</h1>
      <h3>{{ siae.addresse_ligne_1 }}</h3>
      <div class="flex justify-between py-4">
        <p v-if="siae.mis_a_jour_le" class="my-auto">
          Mis à jour le {{ siae.mis_a_jour_le.split('T')[0] }}
        </p>
        <a
          v-if="siae.site_web"
          class="flex gap-4 rounded bg-brand-primary py-2 px-4 text-xl font-semibold text-brand-secondary hover:bg-brand-primary-dark"
          :href="siae.site_web"
          target="_blank"
          rel="noopener noreferrer"
        >
          Site web
          <Goarrow class="my-auto" />
        </a>
      </div>
      <p>{{ siae.description }}</p>
    </div>
    <hr class="mx-auto h-1 w-96 bg-gray-light" />
    <div class="p-5">
      <h3 class="mt-4 text-xl">Postes proposés :</h3>
      <div
        v-for="poste in siae.postes"
        :key="poste.id"
        class="smooth my-4 rounded-xl bg-brand-primary-light p-4"
      >
        <p class="font-semibold">{{ poste.rome }}</p>
        <p class="my-3 text-n-gray">
          Poste créé le {{ poste.cree_le.split('T')[0] }}
        </p>
        <p>{{ poste.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useJobsStore } from '../../stores/Jobs.js'
import Goarrow from '../assets/Goarrow.svg'

export default {
  components: { Goarrow },
  data() {
    return {
      jobs: useJobsStore(),
    }
  },
  computed: {
    siae() {
      return this.jobs.selected
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
