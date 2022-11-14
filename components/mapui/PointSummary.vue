<template>
  <div
    class="z-600 absolute top-36 right-8 max-w-3xl rounded-3xl bg-brand-secondary p-6 text-xl"
  >
    <div v-if="toggleDelete" class="bg-brand-secondary p-6 text-xl">
      <p class="pb-4">Etes-vous sûr.e de vouloir supprimer ce lieu ?</p>
      <div class="text-md flex justify-between">
        <button
          class="rounded py-1 px-2 hover:bg-brand-primary-dark hover:text-brand-secondary"
          @click="toggleDelete = false"
        >
          Non, garder ce lieu
        </button>
        <button
          class="rounded bg-brand-red py-1 px-2 text-brand-secondary hover:bg-brand-red-dark"
          @click="$emit('remove')"
        >
          Oui, supprimer ce lieu
        </button>
      </div>
    </div>

    <div v-else>
      <div class="grid grid-cols-2 divide-x divide-gray-600 p-5">
        <div class="flex flex-col space-y-4 pr-4">
          <p class="font-bold">{{ point.name }}</p>
          <p
            class="rounded-xl text-center"
            :class="point.goAlone ? 'bg-brand-yellow' : 'bg-brand-violet'"
          >
            {{ point.goAlone ? 'Seul.e' : 'Accompagné.e' }}
          </p>
          <p class="text-center">{{ point.mobility }}</p>
          <p class="text-center">{{ point.frequency }}</p>
        </div>
        <div class="pl-4">
          <div class="flex justify-end">
            <div
              class="-mr-4 -mt-8 flex h-10 w-10 rotate-90 items-center justify-center rounded-full pb-1 text-2xl font-bold text-white"
              :class="point.goAlone ? 'bg-brand-yellow' : 'bg-brand-violet'"
            >
              {{
                point.appreciation === 'DISLIKE'
                  ? ': ('
                  : point.appreciation === 'LIKE'
                  ? ': )'
                  : ': |'
              }}
            </div>
          </div>
          <p class="font-bold">Notes complémentaires :</p>
          <p class="m-2">
            {{ point.description.length ? point.description : `Aucune note` }}
          </p>
        </div>
      </div>
      <div class="mt-8 flex justify-between space-x-4">
        <div class="flex gap-4">
          <button
            class="icon h-10 w-10 items-center justify-center rounded-full bg-brand-red bg-opacity-80 pt-1 text-brand-secondary hover:bg-brand-red-dark hover:bg-opacity-100"
            @click="toggleDelete = true"
          >
            &#xEA02;
          </button>
          <button
            class="rounded-lg border-2 py-1 px-4"
            :class="
              home?.id === point.id
                ? 'cursor-not-allowed border-brand-primary text-brand-primary-dark'
                : 'border-n-gray text-n-gray hover:border-gray-lighter hover:text-gray-lighter'
            "
            @click="selectNewHome"
          >
            Point de départ
          </button>
        </div>

        <button
          class="icon h-10 w-10 items-center justify-center rounded-full bg-brand-primary pt-1 text-brand-secondary hover:bg-brand-primary-dark"
          @click="$emit('edit')"
        >
          &#xEA01;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    point: {
      type: Object,
      default: () => ({}),
    },
    home: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      toggleDelete: false,
    }
  },
  methods: {
    selectNewHome() {
      if (this.home?.id !== this.point.id)
        this.$emit('selectHome', this.point.id)
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
