<template>
  <div v-if="!selected" class="p-6">
    <div v-for="type in ['accessible', 'notAccessible']" :key="type">
      <button
        class="flex w-full justify-between rounded px-2 py-2 hover:bg-brand-primary hover:text-brand-secondary"
        @click="openedPanels[type] = !openedPanels[type]"
      >
        <h4 class="text-xl font-bold">ENTREPRISE(S) DES POSSIBLES</h4>
        <Crossleft
          class="mr-2 mt-1 cursor-pointer"
          :class="openedPanels[type] ? '-rotate-90' : 'rotate-180'"
        />
      </button>

      <div v-if="openedPanels[type]">
        <div
          v-if="!sortedCompanies[type].length"
          class="flex h-full w-full justify-center"
        >
          <h3
            class="my-4 mx-2 flex h-full w-full justify-center rounded bg-brand-primary-light p-6"
          >
            AUTRE ENTREPRISE
          </h3>
        </div>
        <div v-else class="ml-3 mt-1 flex justify-center">
          <p>{{ sortedCompanies[type].length }} Entreprises disponibles</p>
        </div>
        <div
          v-for="(company, i) in sortedCompanies[type]"
          :key="company"
          class="my-4 mx-2 rounded-md py-3 px-4"
          :class="
            company.isAccessible ? 'bg-brand-primary-light' : 'bg-brand-violet'
          "
        >
          <p class="font-bold">{{ company.name }}</p>
          <p class="font-bold">{{ company.address }}</p>
          <p class="font-bold">{{ company.naf_text }}</p>
          <div class="my-4">
            <div
              v-for="trace in enumTraces(company)"
              :key="trace"
              class="my-3 flex justify-between gap-6"
            >
              <div class="flex gap-4 py-2">
                <img :src="getTraceIcon(trace.type)" />
                <p>{{ getDuration(trace.duration) }}</p>
              </div>

              <a
                v-if="['carpooling', 'transports'].includes(trace.type)"
                class="my-auto cursor-pointer rounded-md bg-brand-primary py-2 px-4 text-brand-secondary hover:bg-brand-primary-dark"
                :href="
                  trace.type === 'carpooling'
                    ? `https://www.blablacar.fr/`
                    : `https://www.tag.fr/8-horaires.htm?code=SEM%3A${trace.steps[1].line.Number}`
                "
                target="_blank"
                rel="noopener noreferrer"
              >
                VOIR LE TRAJET
              </a>
            </div>
          </div>

          <div class="flex justify-end gap-2 text-brand-secondary">
            <a
              v-if="['carpooling', 'transports'].includes(jobs.terms.vehicle)"
              class="cursor-pointer rounded-md bg-brand-primary py-2 px-4 text-brand-secondary hover:bg-brand-primary-dark"
              :href="
                jobs.terms.vehicle === 'carpooling'
                  ? `https://www.blablacar.fr/`
                  : `https://www.tag.fr/8-horaires.htm?code=SEM%3A${company.trace.steps[1].line.Number}`
              "
              target="_blank"
              rel="noopener noreferrer"
            >
              VOIR LE TRAJET
            </a>
            <button
              class="rounded-md bg-brand-primary py-2 px-4 hover:bg-brand-primary-dark"
              @click="$emit('select', company, i)"
            >
              VOIR L'ENTREPRISE
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="mb-16 p-2">
    <div class="mb-6 px-5">
      <h1 class="mb-2 text-2xl font-bold">{{ selected.name }}</h1>
      <h3>{{ selected.address }}</h3>
      <p>Siret : {{ selected.siret }}</p>
      <div class="flex justify-between py-4">
        <a
          class="flex gap-4 rounded bg-brand-primary py-2 px-4 text-xl font-semibold text-brand-secondary hover:bg-brand-primary-dark"
          :href="selected.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          Voir sur LaBonneBoite
          <Goarrow class="my-auto" />
        </a>
        <a
          v-if="selected.website"
          class="flex gap-4 rounded bg-brand-primary py-2 px-4 text-xl font-semibold text-brand-secondary hover:bg-brand-primary-dark"
          :href="selected.website"
          target="_blank"
          rel="noopener noreferrer"
        >
          Site Web
          <Goarrow class="my-auto" />
        </a>
      </div>

      <div
        v-for="trace in enumTraces(selected)"
        :key="trace"
        class="my-4 flex justify-between"
      >
        <div class="my-2 flex gap-6">
          <img class="h-9" :src="getTraceIcon(trace.type)" />
          <p>{{ getDuration(trace.duration) }}</p>
        </div>
        <a
          v-if="['carpooling', 'transports'].includes(trace.type)"
          class="my-auto cursor-pointer rounded-md bg-brand-primary py-2 px-4 text-brand-secondary hover:bg-brand-primary-dark"
          :href="
            trace.type === 'carpooling'
              ? `https://www.blablacar.fr/`
              : `https://www.tag.fr/8-horaires.htm?code=SEM%3A${trace.steps[1].line.Number}`
          "
          target="_blank"
          rel="noopener noreferrer"
        >
          VOIR LE TRAJET
        </a>
      </div>
      <p>{{ selected.naf_text }}</p>
      <p>Contact : {{ selected.contact_mode }}</p>
    </div>
    <hr class="mx-auto h-1 w-96 bg-gray-light" />
    <div class="mb-6 mt-6 px-5">
      <p>Naf : {{ selected.naf_text }}</p>
      <p>Code rome : {{ selected.matched_rome_code }}</p>
      <p>Label rome : {{ selected.matched_rome_label }}</p>
      <p class="m-4 bg-brand-primary-light p-4">
        {{ selected.headcount_text }}
      </p>
    </div>
  </div>
</template>

<script>
import { useJobsStore } from '../../stores/Jobs.js'
import { useNavigationStore } from '../../stores/Navigation.js'
import Goarrow from '../assets/Goarrow.svg'
import Crossleft from '../assets/Crossleft.svg'

const DurationToText = (duration) => {
  const pattern =
    /^PT(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d{1,3})?)S)?$/
  const part = pattern.exec(duration)
  return `${part[2] ? part[2] + ' HEURE(S) ' : ''}${
    part[3] ? part[3] + ' MINUTES' : ''
  }`
}

export default {
  components: { Goarrow, Crossleft },
  data() {
    return {
      jobs: useJobsStore(),
      nav: useNavigationStore(),
      openedPanels: {
        accessible: true,
        notAccessible: true,
      },
    }
  },
  computed: {
    selected() {
      return this.jobs.selected
    },
    sortedCompanies() {
      const companies = {
        accessible: [],
        notAccessible: [],
      }

      this.jobs.companies.forEach((company) => {
        companies[company.isAccessible ? 'accessible' : 'notAccessible'].push(
          company
        )
      })

      return companies
    },
  },
  methods: {
    getTraceIcon(type) {
      return `/assets/vehiclesBlack/${type}.png`
    },
    getDuration(duration) {
      return DurationToText(duration)
    },
    enumTraces(company) {
      return Object.values(company.traces)
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
