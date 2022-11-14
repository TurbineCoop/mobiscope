<template>
  <nav class="z-1100 absolute top-0 w-screen bg-brand-primary">
    <div class="flex justify-between py-2 px-4">
      <div class="align-center flex gap-4">
        <BurgerMenu
          class="my-auto cursor-pointer"
          @click="navigation.toggleSidebar()"
        />
        <BrandLogo class="my-auto hidden xl:block" />
      </div>

      <div class="my-auto text-2xl text-brand-secondary">
        <h1>{{ navigation.pageTitle }}</h1>
      </div>
      <div
        v-if="
          ['Mes déplacements familiers', 'Consulter mes possibles'].includes(
            navigation.pageTitle
          )
        "
        class="ml-24 flex cursor-pointer gap-4"
      >
        <NavButtonsSearchButton
          v-if="!navigation.invalidMap"
          :full="!jobs.offersCount"
          @click="navigation.toggleSearch"
        />
        <Print
          v-if="!navigation.printNode"
          class="my-auto"
          @click="navigation.printNode = 'mapToPrint'"
        />
      </div>
      <div v-else class="my-auto py-3 px-24 text-brand-primary">p</div>
    </div>
  </nav>
</template>

<script>
import BurgerMenu from '../assets/BurgerMenu.svg'
import BrandLogo from '../assets/BrandLogo.svg'
import Print from '../assets/Print.svg'
import { useJobsStore } from '@/stores/Jobs'
import { useNavigationStore } from '@/stores/Navigation'

export default {
  components: {
    BurgerMenu,
    BrandLogo,
    Print,
  },
  data() {
    return {
      jobs: useJobsStore(),
      navigation: useNavigationStore(),
    }
  },
}
</script>

<style>
.z-1100 {
  z-index: 4000;
}
</style>

<style scoped>
* {
  transition: 0.2s;
}
</style>
