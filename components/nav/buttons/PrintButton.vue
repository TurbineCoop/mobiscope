<template>
  <div
    class="text-1xl rounded-sm text-brand-secondary ring-2 ring-brand-secondary"
  >
    <div class="flex gap-2 p-2">
      <p class="hidden xl:block">{{ offersNumber }} OFFRES</p>
      <Print class="my-auto" />
    </div>
  </div>
</template>

<script>
import Print from '../../assets/Print.svg'

export default {
  components: {
    Print,
  },
  props: {
    offersNumber: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
