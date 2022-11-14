<template>
  <div>
    <p class="font-bold">{{ element.enseigne }}</p>
    <p class="font-bold">
      {{ element.addresse_ligne_1 }}, {{ element.ville }}
      {{ element.code_postal }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    element: { type: Object, default: () => {} },
  },
}
</script>
