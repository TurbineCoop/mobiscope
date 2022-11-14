<template>
  <div class="z-1100 absolute bottom-10 right-10">
    <div
      class="flex cursor-pointer justify-center rounded-xl bg-brand-primary py-10 hover:bg-brand-primary-dark"
      @click.prevent="$emit('print')"
    >
      <Camera />
    </div>
    <button
      class="mt-4 flex gap-3 rounded bg-brand-red p-2 text-brand-secondary hover:bg-brand-red-dark"
      @click="$emit('close')"
    >
      Fermer la capture
    </button>
  </div>
</template>

<script>
import Camera from '../assets/Camera.svg'
export default {
  components: { Camera },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
