<template>
  <div
    class="z-600 absolute top-36 right-10 w-96 rounded-3xl bg-brand-secondary p-4 text-xl"
  >
    <div class="flex-inline m-2">
      <p class="mb-4 font-bold">{{ step.title }}</p>
      <ul
        v-if="
          step.choices &&
          (step.choices.length || typeof step.choices === 'object')
        "
      >
        <li
          v-for="choice in step.choices"
          :key="choice"
          class="my-1 cursor-pointer rounded-full px-2 py-1 hover:hover:bg-brand-primary-dark hover:text-brand-secondary"
          :class="
            point[step.ref] === choice
              ? 'bg-gray-light text-brand-secondary'
              : ''
          "
          @click="next(choice)"
        >
          {{ choice }}
        </li>
      </ul>
      <textarea
        v-else
        v-model="point[step.ref]"
        :placeholder="step.placeholder"
        class="w-full rounded border border-opacity-50 p-4 text-sm"
      />
    </div>
    <p
      v-show="stepRequiredError"
      class="rounded-2xl bg-red-100 p-2 text-base font-semibold text-red-700"
    >
      Vous devez compléter cette étape avant de continuer
    </p>
    <div class="mt-8 flex space-x-2">
      <button
        v-if="step.ref === 'tag'"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red bg-opacity-80 text-3xl text-brand-secondary hover:bg-brand-red-dark hover:bg-opacity-100"
        @click="$emit('close')"
      >
        <span class="-mt-1">&times;</span>
      </button>
      <button
        v-if="step.ref !== 'tag'"
        class="rounded-full px-3 text-sm hover:bg-brand-primary-dark hover:text-white"
        @click="goBack"
      >
        &larr; Étape précédente
      </button>
      <div class="flex-grow" />
      <button
        class="h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-brand-secondary hover:bg-brand-primary-dark"
        @click="next(false)"
      >
        &#10003;
      </button>
    </div>
  </div>
</template>

<script>
const steps = [
  {
    ref: 'tag',
    title: 'Quel est le type de lieu ?',
    choices: [
      'Domicile',
      'Etablissement scolaire',
      'Amis / Famille',
      'Loisirs',
      'Commerce',
      'Sante',
      'Administratif',
      'Travail et formation (lieu ancien ou actuel)',
      'Autre',
    ],
  },
  {
    ref: 'name',
    title: 'Nom du lieu',
    placeholder: 'Nommez ce lieu',
  },
  {
    ref: 'description',
    title: 'Notes complémentaires',
    placeholder: 'Ajoutez, si besoin, des notes sur ce lieu',
    optional: true,
  },
  {
    ref: 'appreciation',
    title: 'Quel est votre ressenti par rapport à ce lieu ?',
    choices: {
      LIKE: 'J’aime',
      DISLIKE: 'J’aime pas',
      INDIFFERENT: 'Peu importe',
    },
    getDbValue(selectedValue) {
      return Object.entries(this.choices).find(
        ([_, value]) => value === selectedValue
      )[0]
    },
  },
  {
    ref: 'mobility',
    title: 'Comment vous vous y rendez ?',
    choices: [
      'A pied',
      'En vehicule motorise',
      'En bus/car/tram/train',
      'En covoiturage',
      'En velo',
      'En velo electrique',
    ],
  },
  {
    ref: 'vehiculePossessedBy',
    title: 'Est-ce :',
    choices: ['Le mien', "Celui d'un proche", 'Une location'],
  },
  {
    ref: 'goAlone',
    title: 'Etes-vous :',
    choices: ['Seul.e', 'Accompagné.e/aidé.e'],
    getDbValue(selectedValue) {
      return selectedValue === 'Seul.e'
    },
  },
  {
    ref: 'frequency',
    title: 'A quelle frequence ?',
    choices: [
      'Plusieurs fois par semaine',
      'Plusieurs fois par mois',
      'Plusieurs fois par an',
      "Je n'y vais plus",
    ],
  },
]

const emptyPoint = () => ({
  adress: '',
  tag: '',
  description: '',
  mobility: 'A pied',
  vehiculePossessedBy: '',
  goAlone: 'Seul.e',
  frequency: '',
})

export default {
  props: {
    location: {
      type: Array,
      default: () => [0, 0],
    },
    pointId: {
      type: Number,
      default: -1,
    },
    oldData: {
      type: Object,
      default: () => {},
    },
    home: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      point: emptyPoint(),
      stepIndex: 0,
      stepRequiredError: false,
    }
  },
  computed: {
    step() {
      if (!this.home)
        return {
          ref: 'tag',
          title: 'Quel est le type de lieu ?',
          choices: ['Domicile'],
        }
      return steps[Math.min(this.stepIndex, steps.length - 1)]
    },
  },
  mounted() {
    if (this.oldData?.traces && this.oldData?.tag !== 'Domicile') {
      const old = this.oldData
      old.goAlone = old.goAlone ? 'Seul.e' : 'Accompagné.e/aidé.e'
      old.appreciation = {
        LIKE: 'J’aime',
        DISLIKE: 'J’aime pas',
        INDIFFERENT: 'Peu importe',
      }[old.appreciation]
      this.point = old
    }
  },
  methods: {
    next(value) {
      if (!this.step.optional && !value && !this.point[this.step.ref]) {
        this.stepRequiredError = true
        return
      }

      this.stepRequiredError = false

      if (value && this.step.getDbValue)
        this.point[this.step.ref] = this.step.getDbValue(value)
      else if (value) this.point[this.step.ref] = value

      if (this.step.ref === 'tag' && value === 'Domicile') {
        Object.assign(this.point, {
          goAlone: true,
        })
        return this.send()
      }

      if (this.step.ref === 'mobility') {
        if (
          ['En velo', 'En velo electrique', 'En vehicule motorise'].includes(
            value
          )
        )
          return this.stepIndex++
        else return (this.stepIndex += 2)
      }

      if (this.stepIndex === steps.length - 1) return this.send()

      this.stepIndex++
    },
    goBack() {
      const goBackStep =
        this.step.ref === 'goAlone' &&
        !['En velo', 'En velo electrique', 'En vehicule motorise'].includes(
          this.point.mobility
        )
          ? 2
          : 1

      this.stepIndex = Math.min(
        Math.max(this.stepIndex - goBackStep, 0),
        steps.length - 1
      )
    },
    send() {
      if (this.pointId !== -1) {
        this.point.id = this.pointId
      }
      if (typeof this.point.goAlone === 'string')
        this.point.goAlone = this.point.goAlone === 'Seul.e'

      if (this.oldData?.traces) {
        this.point.appreciation = {
          'J’aime': 'LIKE',
          'J’aime pas': 'DISLIKE',
          'Peu importe': 'INDIFFERENT',
        }[this.point.appreciation]
      }
      this.$emit('send', { ...this.point, location: this.location })
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
