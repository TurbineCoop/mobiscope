<template>
  <div v-if="terms?.withVehicles">
    <div class="flex justify-between">
      <div class="flex">
        <h3 class="my-auto mr-2 text-xl">Je recherche :</h3>
        <button
          v-for="type in [
            'Un emploi',
            'Une formation',
            'Une SIAE',
            'Une entreprise active',
          ]"
          :key="type"
          class="mx-1 rounded-full py-2 px-4 text-xl ring-2 ring-brand-primary hover:bg-brand-primary-dark hover:text-brand-secondary hover:ring-brand-primary-dark"
          :class="
            type === terms.searchType
              ? 'bg-brand-primary text-brand-secondary'
              : 'ring-brand-primary hover:ring-brand-primary-dark'
          "
          @click="terms.searchType = type"
        >
          {{ type }}
        </button>
      </div>
      <button
        class="px-3 hover:ring-2 hover:ring-n-gray"
        @click="$emit('close')"
      >
        <CrossBlack />
      </button>
    </div>

    <div
      v-if="['Un emploi', 'Une entreprise active'].includes(terms.searchType)"
      class="mt-6 flex"
    >
      <h3 class="my-auto mr-2 text-xl">Dans le(s) domaine(s) :</h3>
      <div :class="appendSector ? '' : 'flex'">
        <select
          v-model="terms.activitySector"
          required
          class="mx-4 my-auto h-10 rounded p-2 text-lg ring-2 ring-brand-primary"
        >
          <option value="">Domaine d'activité</option>
          <option v-for="s in sectors" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div>
    </div>

    <div class="mt-6 flex">
      <h3 class="my-auto text-xl">Je possède ou j'emprunte :</h3>
      <div class="ml-2 flex">
        <div class="flex divide-x">
          <button
            v-for="btn in l"
            :key="btn"
            class="mx-1 rounded-full py-2 px-5 hover:bg-brand-primary-dark hover:ring-0"
            :class="[
              vehiclesDisabled.includes(btn)
                ? 'cursor-not-allowed bg-gray-lighter hover:bg-gray-lighter'
                : terms.withVehicles[btn]
                ? 'bg-brand-primary'
                : 'ring-2 ring-brand-primary',
            ]"
            @click="
              !vehiclesDisabled.includes(btn)
                ? (terms.withVehicles[btn] = !terms.withVehicles[btn])
                : ''
            "
          >
            <img
              :src="`/assets/${
                terms.withVehicles[btn] ? 'vehicles' : 'vehiclesBlack'
              }/${btn}.png`"
            />
          </button>
        </div>
        <h3
          v-if="vehiclesDisabled.length"
          class="text-md ml-4 mt-auto text-n-gray"
        >
          Les modes de transports grisés ne sont actuellement pas disponibles
        </h3>
      </div>
    </div>

    <div class="mt-6 flex">
      <h3 class="text-xl">Durée maximum de trajet (minutes) :</h3>
      <input
        v-model="maxDuration"
        type="text"
        class="mx-4 my-auto h-10 w-20 rounded p-2 text-lg ring-2 ring-brand-primary"
      />
    </div>
    <div v-if="!loading" class="flex justify-end gap-4">
      <button
        class="flex rounded-xl border border-brand-violet-dark py-2 px-4 text-brand-violet-dark hover:bg-brand-violet hover:text-brand-secondary"
        @click="initParams()"
      >
        <p class="my-auto ml-2 text-xl">REINITIALISER</p>
      </button>
      <button
        class="flex rounded-xl py-2 px-4"
        :class="
          isResearchReady
            ? 'bg-brand-primary hover:bg-brand-primary-dark'
            : 'cursor-not-allowed bg-gray-light'
        "
        @click="search()"
      >
        <Search />
        <p class="my-auto ml-2 text-xl text-brand-secondary">RECHERCHER</p>
      </button>
    </div>
  </div>
</template>

<script>
import Search from '../assets/Search.svg'
import CrossBlack from '../assets/CrossBlack.svg'

import { useJobsStore } from '../../stores/Jobs'
import { useBenefStore } from '../../stores/Benef'

const parseDuration = (duration) => {
  const pattern =
    /^PT(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d{1,3})?)S)?$/
  return pattern.exec(duration)
}
const durationToMinutes = (duration) => {
  const part = parseDuration(duration)
  const seconds =
    (((part[1] === undefined ? 0 : part[1] * 1) * 24 +
      (part[2] === undefined ? 0 : part[2] * 1)) *
      60 +
      (part[3] === undefined ? 0 : part[3] * 1)) *
      60 +
    (part[4] === undefined ? 0 : part[4] * 1)

  return Math.floor(seconds / 60)
}

function minutesToDuration(s) {
  const days = Math.floor(s / 1440)
  s = s - days * 1440
  const hours = Math.floor(s / 60)
  s = s - hours * 60

  return `PT${days ? days + 'D' : ''}${hours ? hours + 'H' : ''}${s}M`
}

export default {
  components: { Search, CrossBlack },
  props: {
    initialMaxDuration: { type: String, default: '' },
  },
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
      benef: useBenefStore(),
      jobs: useJobsStore(),
      sectors: useJobsStore().sectors,
      maxDuration: '',
      terms: null,
      loading: false,
      appendSector: false,
      vehiclesDisabled: ['bicycle', 'elecBicycle', 'scooter'],
    }
  },
  computed: {
    isSectorNeeded() {
      return ['Un emploi', 'Une entreprise active'].includes(
        this.terms.searchType
      )
    },
    isResearchReady() {
      let ready = false
      Object.values(this.terms.withVehicles).forEach((e) => {
        if (e) ready = true
      })
      if (this.isSectorNeeded && !this.terms.activitySector) ready = false
      if (!parseInt(this.maxDuration)) return false
      return ready
    },
  },
  mounted() {
    this.initParams()
    this.sectors = Object.keys(this.jobs.sectors)
  },
  methods: {
    search() {
      if (!this.isResearchReady) return
      this.loading = true
      if (this.isSectorNeeded) {
        this.terms.activitySectorName = this.terms.activitySector
        this.terms.activitySector = this.jobs.sectors[this.terms.activitySector]
      }

      this.$emit(
        'updateDuration',
        minutesToDuration(parseInt(this.maxDuration))
      )
      this.$emit('search', this.terms, true)
    },
    initParams() {
      this.maxDuration = durationToMinutes(this.initialMaxDuration)
      this.terms = {
        searchType: this.jobs.terms?.searchType || 'Un emploi',
        activitySector: this.terms?.activitySector || this.benef.activitySector,
        acceptChanges: true,
        withVehicles: {
          transports: false,
          pedestrian: false,
          carOrBike: false,
          carpooling: false,
          bicycle: false,
          elecBicycle: false,
          scooter: false,
        },
      }
      this.jobs.filtersUpdated = false
    },
  },
}
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>

<style scoped>
* {
  transition: 0.2s;
}
</style>
