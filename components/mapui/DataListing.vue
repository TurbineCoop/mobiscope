<template>
  <div v-if="!jobs.selected" class="p-6">
    <div v-for="type in ['accessible', 'notAccessible']" :key="type">
      <button
        class="flex w-full justify-between rounded px-2 py-2 hover:bg-brand-primary hover:text-brand-secondary"
        @click="openedPanels[type] = !openedPanels[type]"
      >
        <h4 class="text-xl font-bold">
          {{ sortedElements[type].length }} {{ layerToFr(false, type) }}
        </h4>
        <Crossleft
          class="mr-2 mt-1 cursor-pointer"
          :class="openedPanels[type] ? '-rotate-90' : 'rotate-180'"
        />
      </button>

      <div v-if="openedPanels[type]">
        <div
          v-if="!sortedElements[type].length"
          class="flex h-full w-full justify-center"
        >
          <h3
            class="my-4 mx-2 flex h-full w-full justify-center rounded bg-brand-primary-light p-6"
          >
            Aucun(e) {{ layerToFr() }} {{ typeText(type) }}
          </h3>
        </div>
        <div
          v-for="(element, i) in sortedElements[type]"
          :key="element"
          class="my-4 mx-2 rounded-md py-3 px-4"
          :class="
            element.isAccessible ? 'bg-brand-primary-light' : 'bg-gray-lighter'
          "
        >
          <MapuiDataSmallCompany
            v-if="layer === 'companies'"
            :element="element"
          />
          <MapuiDataSmallSiae v-if="layer === 'siaes'" :element="element" />
          <MapuiDataSmallFormation
            v-if="layer === 'formations'"
            :element="element"
          />
          <MapuiDataSmallOffer v-if="layer === 'offers'" :element="element" />
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
            class="mx-auto mt-6 w-1/2 bg-n-gray bg-opacity-30 p-4 text-center text-white"
          >
            <p>Aucun trajet disponible</p>
          </div>

          <div class="mt-10 flex justify-end gap-2 text-brand-secondary">
            <button
              class="rounded-md bg-brand-primary py-2 px-4 hover:bg-brand-primary-dark"
              @click="$emit('select', element, i)"
            >
              VOIR {{ layerToFr(true).toUpperCase() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="mb-16 p-2">
    <MapuiDataFullCompany
      v-if="layer === 'companies'"
      :element="jobs.selected"
      :home="jobs.home"
    />
    <MapuiDataFullSiae
      v-if="layer === 'siaes'"
      :element="jobs.selected"
      :home="jobs.home"
    />
    <MapuiDataFullFormation
      v-if="layer === 'formations'"
      :element="jobs.selected"
      :home="jobs.home"
    />
    <MapuiDataFullOffer
      v-if="layer === 'offers'"
      :element="jobs.selected"
      :home="jobs.home"
    />
  </div>
</template>

<script>
import Crossleft from '../assets/Crossleft.svg'
import { useJobsStore } from '@/stores/Jobs.js'
import { useNavigationStore } from '@/stores/Navigation.js'

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
  props: {
    layer: { type: String, default: 'offers' },
  },
  data() {
    return {
      jobs: useJobsStore(),
      nanotAccessible: useNavigationStore(),
      openedPanels: {
        accessible: true,
        notAccessible: true,
      },
    }
  },
  computed: {
    sortedElements() {
      const data = {
        accessible: [],
        notAccessible: [],
      }

      this.jobs[this.layer].forEach((el) => {
        data[el.isAccessible ? 'accessible' : 'notAccessible'].push(el)
      })

      return data
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
    layerToFr(simple, type) {
      if (this.layer)
        return {
          offers: {
            accessible: `Offre(s) des possibles`,
            notAccessible: `Autre(s) Offre(s)`,
            sim: `l'offre`,
          },
          formations: {
            accessible: `Centre(s) de formation des possibles`,
            notAccessible: `Autre(s) Centre(s) de formation`,
            sim: `le centre de formation`,
          },
          siaes: {
            accessible: `SIAE(s) des possibles`,
            notAccessible: `Autre(s) SIAE`,
            sim: `la SIAE`,
          },
          companies: {
            accessible: `Entreprise(s) des possibles`,
            notAccessible: `Autre(s) Entreprise(s)`,
            sim: `l'entreprise`,
          },
        }[this.layer][simple ? 'sim' : type]
      else return ''
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
