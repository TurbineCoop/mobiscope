<template>
  <div class="my-auto">
    <div
      v-if="full"
      class="text-1xl rounded-sm text-brand-secondary ring-brand-secondary xl:ring-2"
    >
      <div class="flex gap-2 p-2">
        <p class="hidden xl:block">DEMARRER UNE RECHERCHE</p>
        <Search />
      </div>
    </div>

    <Search v-else />
  </div>
</template>

<script>
import Search from '../../assets/Search.svg'

export default {
  components: { Search },
  props: {
    full: Boolean,
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
