<template>
  <div>
    <NavNavbar v-if="user.id" />
    <NavSidebar class="absolute top-0" />
    <NavLoading
      v-if="nav.loading"
      :class="nav.loading === 'full' ? '' : 'bg-opacity-30'"
      :fill="nav.loading === 'full'"
      class="z-1100 absolute flex h-screen w-screen justify-center bg-brand-primary"
    />
    <slot />
  </div>
</template>

<script>
import { useUserStore } from '@/stores/User'
import { useBenefStore } from '@/stores/Benef'
import { useNavigationStore } from '@/stores/Navigation'
import 'leaflet/dist/leaflet.css'

export default {
  data() {
    return {
      user: useUserStore(),
      nav: useNavigationStore(),
    }
  },
  mounted() {
    this.redirectLogin()
  },
  updated() {
    this.redirectLogin()
  },
  methods: {
    async redirectLogin() {
      if (!this.user?.id && window.location.pathname !== '/user/password-reset')
        await useUserStore().updateBenefs()

      if (
        !this.user?.id &&
        window.location.pathname !== '/user/password-reset'
      ) {
        return navigateTo('/user/login', { replace: true })
      }

      if (!useBenefStore().id) return navigateTo('/', { replace: true })
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
