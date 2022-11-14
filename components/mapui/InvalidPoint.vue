<template>
  <div class="my-auto h-1/3 w-1/3 rounded-xl bg-brand-secondary">
    <div
      class="flex cursor-pointer justify-end pr-3 pt-3"
      @click="$emit('close')"
    >
      <CrossBlack />
    </div>

    <h2 class="py-4 px-10 text-2xl font-bold">
      {{ pointName }} est en dehors du département de l'Isère, il ne peut donc
      pas être prit en compte.
    </h2>
  </div>
</template>

<script>
import CrossBlack from '../assets/CrossBlack.svg'

export default {
  components: { CrossBlack },
  props: { pointName: { type: String, default: '' } },
}
</script>
