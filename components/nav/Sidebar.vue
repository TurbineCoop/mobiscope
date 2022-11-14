<template>
  <nav
    v-show="nav.sidebarOpened"
    class="z-1100 absolute h-screen w-2/4 bg-brand-primary-dark xl:w-1/3"
  >
    <div class="flex justify-between xl:justify-start">
      <Cross class="m-5 cursor-pointer" @click="closeSideBar()" />
      <BrandLogo class="m-5 my-auto pt-1 xl:mx-0 xl:block" />
    </div>

    <div>
      <div v-if="benef.firstName" class="mx-10 mt-10">
        <p class="text-xl text-brand-secondary">
          Bénéficiaire actuel : {{ benef.firstName }} {{ benef.lastName }}
          {{ benef.id }}
        </p>
      </div>
      <NavButtonsPageLink v-if="benef.id" :rel="'/map'" :text="'Map'" />
      <NavButtonsPageLink :rel="'/'" :text="'Mes Bénéficiaires'" />
      <div class="mt-20 w-full">
        <div
          class="m-10 flex cursor-pointer gap-4 rounded-sm p-6 text-2xl text-brand-secondary ring-2 ring-brand-secondary hover:bg-brand-primary-light"
          @click.stop="askReset()"
        >
          <p>Réinitialiser mon mot de passe</p>
        </div>
        <div
          class="m-10 flex cursor-pointer gap-4 rounded-sm p-6 text-2xl text-brand-secondary ring-2 ring-brand-secondary hover:bg-brand-primary-light"
          @click.stop="logout()"
        >
          <LeaveArrow class="my-auto -rotate-180" />
          <p>Me déconnecter</p>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import Cross from '../assets/Cross.svg'
import BrandLogo from '../assets/BrandLogo.svg'
import LeaveArrow from '../assets/LeaveArrow.svg'
import { useNavigationStore } from '@/stores/Navigation'
import { useBenefStore } from '@/stores/Benef'
import { useUserStore } from '@/stores/User'

export default {
  components: { Cross, BrandLogo, LeaveArrow },
  data() {
    return {
      nav: useNavigationStore(),
      benef: useBenefStore(),
      user: useUserStore(),
    }
  },
  methods: {
    closeSideBar() {
      this.nav.toggleSidebar()
    },
    logout() {
      this.nav.loading = 'full'
      this.user.logout()
      this.closeSideBar()
    },
    async askReset() {
      this.closeSideBar()
      await navigateTo('/user/password-reset/?fromDash=true', { replace: true })
    },
  },
}
</script>

<style>
.z-1020 {
  z-index: 1020;
}
</style>

<style scoped>
* {
  transition: 0.2s;
}
</style>
