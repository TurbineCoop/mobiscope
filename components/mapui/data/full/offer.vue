<template>
  <div id="offerToPrint" class="mb-16 p-2">
    <div class="mt-10 px-5">
      <p class="mb-2 font-bold">{{ element?.intitule }}</p>
      <p class="font-bold">
        {{ element?.entreprise.nom }} -
        {{ element?.lieuTravail.libelle }}
      </p>
      <p class="font-bold">{{ element?.secteurActiviteLibelle }}</p>
      <div class="my-auto flex items-center">
        <p>
          Actualisé le {{ element?.dateActualisation.split('T')[0] }} -

          <a
            class="font-semibold text-brand-primary hover:text-brand-primary-dark"
            :href="element?.origineOffre.urlOrigine"
            target="_blank"
            rel="noopener noreferrer"
          >
            offre n°{{ element?.id }}
          </a>
        </p>
        <img :src="`/assets/img/Poleemploi.png`" class="pl-3" />
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

      <div class="my-6 bg-gray-light p-6">
        <p>
          {{ element?.typeContrat }} -
          {{ element?.dureeTravailLibelleConverti }},
          {{ element?.natureContrat }}
        </p>
        <p>{{ element?.dureeTravailLibelle }}</p>
        <p>Salaire : {{ element?.salaire.libelle }}</p>
      </div>
      <p>{{ element?.description }}</p>
      <div class="my-6">
        <h3 class="text-xl font-bold">Profil Souhaité</h3>
        <p class="mt-1 font-semibold">Expérience</p>
        <p class="ml-4">{{ element?.experienceLibelle }}</p>

        <p v-if="element?.qualitesProfessionnelles" class="mt-1 font-semibold">
          Savoirs et savoir-faire
        </p>
        <div class="ml-4">
          <p v-for="q in element?.qualitesProfessionnelles" :key="q">
            {{ q.description }}
          </p>
        </div>

        <p
          v-if="element?.formations?.domaineLibelle"
          class="mt-1 font-semibold"
        >
          Formation
        </p>
        <p class="ml-4">{{ element?.formations?.domaineLibelle }}</p>

        <p class="mt-1 font-semibold">Infos complémentaires</p>
        <p class="ml-4">Qualification: {{ element?.qualificationLibelle }}</p>
        <p class="ml-4">
          Secteur d'activité: {{ element?.secteurActiviteLibelle }}
        </p>

        <div class="my-6">
          <h3 class="text-xl font-bold">Entreprise</h3>
          <p class="mt-1 ml-4">{{ element?.entreprise.nom }}</p>

          <p v-if="element?.entreprise?.url" class="mt-1 font-semibold">
            Site internet
          </p>
          <p class="ml-4">{{ element?.entreprise.url }}</p>

          <p class="ml-4">{{ element?.entreprise.description }}</p>
        </div>
      </div>
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
      return Object.values(element?.traces)
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
