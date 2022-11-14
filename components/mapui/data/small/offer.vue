<template>
  <div>
    <p class="font-bold">{{ element.intitule }}</p>
    <p class="font-bold">{{ element.entreprise.nom }}</p>
    <p class="font-bold">{{ element.lieuTravail.libelle }}</p>
    <p class="font-bold">{{ element.appellationlibelle }}</p>
  </div>
</template>

<script>
export default {
  props: {
    element: { type: Object, default: () => {} },
  },
}
</script>
