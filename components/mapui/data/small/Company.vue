<template>
  <div>
    <p class="font-bold">{{ element.name }}</p>
    <p class="font-bold">{{ element.address }}</p>
    <p class="font-bold">{{ element.naf_text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    element: { type: Object, default: () => {} },
  },
}
</script>
