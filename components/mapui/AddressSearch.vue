<template>
  <div class="z-600 w-1/3">
    <label class="relative">
      <input
        id="searchInput"
        v-model="searchTerm"
        type="text"
        placeholder="Ou recherchez un lieu..."
        class="w-full rounded-xl border border-gray-light px-4 py-1 text-xl font-light italic"
        :class="showResults && resultsAvailable ? 'rounded-b-none' : ''"
        @focusin="$emit('show')"
      />
    </label>
    <div
      v-if="showResults && resultsAvailable"
      class="rounded-b-xl border border-gray-light border-t-transparent bg-white"
    >
      <ul :id="'ul'" class="text-lg">
        <li
          v-for="(point, index) in results"
          :id="'li-' + index"
          :key="index"
          class="cursor-pointer p-2 hover:bg-brand-primary-dark hover:text-white"
          @click.stop="selectPoint(point.geometry.coordinates.reverse())"
        >
          {{ point.properties.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { geocode } from '@p-j/geocodejson-ban'

const initialState = () => {
  return {
    searchTerm: '',
    results: [],
  }
}

export default defineComponent({
  props: {
    nearby: {
      type: Array,
      default: () => [0, 0],
      required: true,
    },

    showResults: {
      type: Boolean,
      default: true,
    },
  },
  data: initialState,
  computed: {
    resultsAvailable() {
      return this.searchTerm.length && this.results.length
    },
  },
  watch: {
    searchTerm() {
      if (this.searchTerm.length >= 3) this.searchAddress()
    },
  },
  methods: {
    async searchAddress() {
      this.results = (
        await geocode({
          address: this.searchTerm,
          limit: 5,
          lat: this.nearby[0],
          lon: this.nearby[1],
        })
      )?.features
    },
    selectPoint(latlng) {
      this.results = []
      this.searchTerm = ''
      this.$emit('select', { latlng })
    },
  },
})
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
