<template>
  <div>
    <p class="font-bold">{{ element.Nom }}</p>
    <p class="">{{ element.Adresse }} {{ element.context }}</p>
    <p class="font-bold">{{ element.Domaine }}</p>
  </div>
</template>

<script>
export default {
  props: {
    element: { type: Object, default: () => {} },
  },
}
</script>
