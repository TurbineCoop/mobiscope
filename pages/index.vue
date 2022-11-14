<template>
  <div
    class="h-screen w-full rounded pt-20"
    :class="
      benefToDelete || benefToAdd
        ? 'bg-brand-primary-darker'
        : 'bg-brand-primary-dark'
    "
  >
    <div v-if="benefToDelete" class="my-auto mt-20 flex justify-center">
      <div class="-xl bg-brand-secondary p-10 py-10 opacity-100">
        <p class="text-xl">
          Etes-vous sûr.e de vouloir supprimer {{ benefToDelete.firstName }}
          {{ benefToDelete.lastName }} ?
        </p>
        <div class="mt-14 flex justify-center gap-6">
          <button
            class="rounded p-2 hover:bg-brand-primary-dark hover:text-brand-secondary"
            @click="benefToDelete = null"
          >
            Non, garder ce beneficiaire
          </button>
          <button
            class="rounded bg-brand-red p-2 text-brand-secondary hover:bg-brand-red-dark"
            @click="deleteBenef()"
          >
            Oui, supprimer ce beneficiaire
          </button>
        </div>
      </div>
    </div>
    <div v-else class="my-auto flex justify-center pt-8">
      <div>
        <div class="flex rounded-t-xl bg-brand-secondary py-4 pl-10">
          <p class="mr-3">Trier par :</p>
          <button
            v-for="opt in ['Nom', 'Prénom']"
            :key="opt"
            class="py-1 px-2 ring-1 ring-n-gray"
            :class="
              sortOptions.sortBy === opt
                ? 'bg-brand-primary text-brand-secondary'
                : ' hover:bg-brand-primary-dark hover:text-brand-secondary'
            "
            @click="sortBy(opt, sortOptions.increasing)"
          >
            {{ opt }}
          </button>
          <button
            v-if="sortOptions.increasing && sortOptions.sortBy"
            class="ml-4 py-1 px-2 ring-1 ring-n-gray hover:bg-brand-primary-dark hover:text-brand-secondary"
            @click="sortBy(sortOptions.sortBy, false)"
          >
            <p>&#9660;</p>
          </button>
          <button
            v-else-if="!sortOptions.increasing && sortOptions.sortBy"
            class="ml-4 py-1 px-2 ring-1 ring-n-gray hover:bg-brand-primary-dark hover:text-brand-secondary"
            @click="sortBy(sortOptions.sortBy, true)"
          >
            &#9650;
          </button>
        </div>
        <div
          class="list-max-h bg-brand-secondary px-10 py-4"
          :class="user.beneficiaries.length >= 4 ? 'overflow-y-scroll' : ''"
        >
          <div
            v-for="b in user.beneficiaries"
            :key="b.id"
            class="my-4 flex justify-between"
          >
            <nuxt-link
              :to="'/map'"
              class="mr-1 flex w-full cursor-pointer justify-between rounded-md border-2 border-brand-primary-dark py-4 px-10 hover:border-brand-primary hover:bg-brand-primary hover:text-brand-secondary"
              @click="selectBenef(b.id)"
            >
              <p class="text-lg">{{ b.lastName }} {{ b.firstName }}</p>
              <p>{{ b.id }}</p>
            </nuxt-link>
            <div
              class="flex cursor-pointer justify-between rounded-md border-2 border-brand-red py-4 px-6 text-2xl text-brand-red hover:border-brand-red hover:bg-brand-red hover:text-brand-secondary"
              @click="benefToDelete = b"
            >
              ✕
            </div>

            <div
              class="-mr-6 ml-1 flex cursor-pointer justify-between rounded-md border-2 border-n-gray pl-6 pr-4 text-xl hover:bg-n-gray"
              @click="newBenef = { ...b }"
            >
              <Edit
                class="my-auto w-8"
                :src="'../components/assets/Edit.svg'"
              />
            </div>
          </div>
        </div>
        <div class="mb-10 rounded-b-xl bg-brand-secondary p-4"></div>

        <form
          class="gap-5 rounded-xl bg-brand-secondary px-10 py-4"
          @submit.prevent="addBenef()"
        >
          <h1 class="mb-4 flex justify-center text-2xl">
            {{ newBenef.id ? 'Modification' : 'Ajout' }} d'un bénéficiaire
          </h1>
          <div class="flex justify-start gap-4 py-5">
            <input
              v-model="newBenef.firstName"
              type="text"
              class="rounded-b border-b border-b-brand-primary px-2 focus:outline-none"
              placeholder="Nom"
              required
            />
            <input
              v-model="newBenef.lastName"
              type="text"
              class="rounded-b border-b border-b-brand-primary px-2 focus:outline-none"
              placeholder="Prénom"
              required
            />
          </div>
          <select
            v-model="newBenef.activitySector"
            class="my-4 rounded p-2 ring-2 ring-brand-primary"
          >
            <option value="">Secteur d'activité</option>
            <option v-for="s in sectors" :key="s.libelle" :value="s">
              {{ s }}
            </option>
          </select>

          <div class="mt-10 flex justify-end">
            <button
              v-if="newBenef.id"
              class="mx-4 rounded py-2 px-4 hover:bg-brand-red hover:text-brand-secondary"
              @click="resetBenef"
            >
              Annuler la modification
            </button>
            <button
              type="submit"
              :class="
                newBenef.id
                  ? 'bg-brand-violet hover:bg-brand-violet-dark'
                  : 'bg-brand-primary hover:bg-brand-primary-dark'
              "
              class="rounded py-2 px-4 text-brand-secondary"
            >
              {{ newBenef.id ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Edit from '../components/assets/Edit.svg'
import { useNavigationStore } from '@/stores/Navigation'
import { useUserStore } from '@/stores/User'
import { useBenefStore } from '@/stores/Benef'
import { useJobsStore } from '@/stores/Jobs'

const getEmptyBenef = () => ({
  firstName: '',
  lastName: '',
  activitySector: '',
})

export default {
  components: { Edit },
  data() {
    return {
      user: useUserStore(),
      nav: useNavigationStore(),
      benef: useBenefStore(),
      newBenef: getEmptyBenef(),
      jobs: useJobsStore(),

      sectors: [],
      benefToDelete: null,
      benefToEdit: null,
      sortOptions: {
        sortBy: '',
        increasing: true,
      },
    }
  },
  mounted() {
    this.nav.loading = 'full'
    this.nav.updatePage({ title: 'Mes Beneficiaires' })
    this.sectors = Object.keys(this.jobs.sectors)
    this.nav.loading = false
  },
  methods: {
    selectBenef(id) {
      this.nav.loading = 'full'
      this.benef.setBenef(this.user.beneficiaries.find((e) => e.id === id))
    },
    async addBenef() {
      this.nav.loading = 'partial'
      Object.entries(this.jobs.sectors).forEach((e) => {
        if (e[0] === this.newBenef.activitySector)
          this.newBenef.sectorCode = e[1]
      })
      const res = this.newBenef.id
        ? await this.user.editBenef(this.newBenef)
        : await this.user.addBenef(this.newBenef)

      if (!res.error) {
        this.newBenef = getEmptyBenef()
      }
      this.nav.loading = false
    },
    async deleteBenef() {
      await this.user.deleteBenef(this.benefToDelete.id)
      this.benefToDelete = null
    },
    sortBy(type, increasing) {
      const attr = type === 'Nom' ? 'lastName' : 'firstName'
      this.sortOptions = { sortBy: type, increasing }
      this.user.sortBenefsBy({ attr, increasing })
    },
    resetBenef() {
      this.newBenef = getEmptyBenef()
    },
  },
}
</script>

<style>
.list-max-h {
  max-height: 25rem;
}
</style>

<style scoped>
* {
  transition: 0.2s;
}
</style>
