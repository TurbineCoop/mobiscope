<template>
  <div class="m-10 flex justify-between">
    <nuxt-link
      class="w-full rounded-sm p-6 text-2xl text-brand-secondary ring-2 ring-brand-secondary hover:bg-brand-primary-light"
      :to="rel"
      >{{ text }}</nuxt-link
    >
    <!-- error to fix: require is not defined (client side)
    <img :src="require(`../assets/${icon}.svg`)" />
    -->
  </div>
</template>

<script>
export default {
  props: {
    rel: { type: String, default: '/' },
    text: { type: String, default: '' },
    // icon: { type: String, default: 'Search' },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
