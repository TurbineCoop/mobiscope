<template>
  <div>
    <div v-if="!selected" class="p-6">
      <div v-for="type in ['accessible', 'notAccessible']" :key="type">
        <button
          class="flex w-full justify-between rounded px-2 py-2 hover:bg-brand-primary hover:text-brand-secondary"
          @click="openedPanels[type] = !openedPanels[type]"
        >
          <h4 class="text-xl font-bold">
            Offres
            {{ typeText(type) }}
          </h4>
          <Crossleft
            class="mr-2 mt-1 cursor-pointer"
            :class="openedPanels[type] ? '-rotate-90' : 'rotate-180'"
          />
        </button>

        <div v-if="openedPanels[type]">
          <div
            v-if="!sortedOffers[type].length"
            class="flex h-full w-full justify-center"
          >
            <h3
              class="my-4 mx-2 flex h-full w-full justify-center rounded bg-brand-primary-light p-6"
            >
              Aucune offre {{ typeText(type) }}
            </h3>
          </div>
          <div v-else class="ml-3 mt-1 flex justify-center">
            <p>{{ sortedOffers[type].length }} Offres disponibles</p>
          </div>
          <div
            v-for="(offer, i) in sortedOffers[type]"
            :key="offer"
            class="my-4 mx-2 rounded-md py-3 px-4"
            :class="
              offer.isAccessible ? 'bg-brand-primary-light' : 'bg-brand-violet'
            "
          >
            <p class="font-bold">{{ offer.intitule }}</p>
            <p class="font-bold">{{ offer.entreprise.nom }}</p>
            <p class="font-bold">{{ offer.lieuTravail.libelle }}</p>
            <p class="font-bold">{{ offer.appellationlibelle }}</p>
            <div class="my-4">
              <div
                v-for="trace in enumTraces(offer)"
                :key="trace"
                class="my-3 flex justify-between gap-6"
              >
                <div class="flex gap-4 py-2">
                  <img :src="getTraceIcon(trace.type)" />
                  <p>{{ getDuration(trace.duration) }}</p>
                </div>

                <a
                  v-if="
                    ['carpooling', 'transports'].includes(trace.type) &&
                    trace.steps.length > 1
                  "
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
                v-if="
                  ['carpooling', 'transports'].includes(jobs.terms.vehicle) &&
                  trace.steps.length > 1
                "
                class="cursor-pointer rounded-md bg-brand-primary py-2 px-4 text-brand-secondary hover:bg-brand-primary-dark"
                :href="
                  jobs.terms.vehicle === 'carpooling'
                    ? `https://www.blablacar.fr/`
                    : `https://www.tag.fr/8-horaires.htm?code=SEM%3A${offer.trace.steps[1].line.Number}`
                "
                target="_blank"
                rel="noopener noreferrer"
              >
                VOIR LE TRAJET
              </a>
              <button
                class="rounded-md bg-brand-primary py-2 px-4 hover:bg-brand-primary-dark"
                @click="$emit('select', offer, i)"
              >
                VOIR L'OFFRE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else id="offerToPrint" class="mb-16 p-2">
      <div class="mt-10 px-5">
        <p class="mb-2 font-bold">{{ selected.intitule }}</p>
        <p class="font-bold">
          {{ selected.entreprise.nom }} -
          {{ selected.lieuTravail.libelle }}
        </p>
        <p class="font-bold">{{ selected.secteurActiviteLibelle }}</p>
        <div class="my-auto flex items-center">
          <p>
            Actualisé le {{ selected.dateActualisation.split('T')[0] }} -

            <a
              class="font-semibold text-brand-primary hover:text-brand-primary-dark"
              :href="selected.origineOffre.urlOrigine"
              target="_blank"
              rel="noopener noreferrer"
            >
              offre n°{{ selected.id }}
            </a>
          </p>
          <img :src="`/assets/img/Poleemploi.png`" class="pl-3" />
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
            v-if="
              ['carpooling', 'transports'].includes(trace.type) &&
              trace.steps.length > 1
            "
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

        <div class="my-6 bg-gray-light p-6">
          <p>
            {{ selected.typeContrat }} -
            {{ selected.dureeTravailLibelleConverti }},
            {{ selected.natureContrat }}
          </p>
          <p>{{ selected.dureeTravailLibelle }}</p>
          <p>Salaire : {{ selected.salaire.libelle }}</p>
        </div>
        <p>{{ selected.description }}</p>
        <div class="my-6">
          <h3 class="text-xl font-bold">Profil Souhaité</h3>
          <p class="mt-1 font-semibold">Expérience</p>
          <p class="ml-4">{{ selected.experienceLibelle }}</p>

          <p
            v-if="selected.qualitesProfessionnelles"
            class="mt-1 font-semibold"
          >
            Savoirs et savoir-faire
          </p>
          <div class="ml-4">
            <p v-for="q in selected.qualitesProfessionnelles" :key="q">
              {{ q.description }}
            </p>
          </div>

          <p
            v-if="selected?.formations?.domaineLibelle"
            class="mt-1 font-semibold"
          >
            Formation
          </p>
          <p class="ml-4">{{ selected?.formations?.domaineLibelle }}</p>

          <p class="mt-1 font-semibold">Infos complémentaires</p>
          <p class="ml-4">Qualification: {{ selected.qualificationLibelle }}</p>
          <p class="ml-4">
            Secteur d'activité: {{ selected.secteurActiviteLibelle }}
          </p>

          <div class="my-6">
            <h3 class="text-xl font-bold">Entreprise</h3>
            <p class="mt-1 ml-4">{{ selected.entreprise.nom }}</p>

            <p v-if="selected?.entreprise?.url" class="mt-1 font-semibold">
              Site internet
            </p>
            <p class="ml-4">{{ selected.entreprise.url }}</p>

            <p class="ml-4">{{ selected.entreprise.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useJobsStore } from '../../stores/Jobs.js'
import { useNavigationStore } from '../../stores/Navigation.js'
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
  components: { Crossleft },
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
    sortedOffers() {
      const offers = {
        accessible: [],
        notAccessible: [],
      }

      this.jobs.offers.forEach((offer) => {
        offers[offer.isAccessible ? 'accessible' : 'notAccessible'].push(offer)
      })

      return offers
    },
  },
  methods: {
    getTraceIcon(type) {
      return `/assets/vehiclesBlack/${type}.png`
    },
    getDuration(duration) {
      return DurationToText(duration)
    },
    typeText(type) {
      return type === 'accessible' ? type : 'trop éloignées'
    },
    enumTraces(offer) {
      return Object.values(offer.traces)
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
