<template>
  <div>
    <div class="flex h-screen w-full justify-center bg-brand-primary-dark">
      <form
        class="my-auto flex flex-col space-y-6 rounded-xl bg-brand-secondary p-10 text-xl"
        @submit.prevent="login"
      >
        <h1 class="mb-10 flex justify-center text-2xl font-bold">
          Connectez-vous
        </h1>

        <div>
          <label for="mail">Email</label>
          <input
            id="mail"
            v-model="email"
            type="email"
            class="my-1 flex w-96 rounded border-2 border-gray-light p-2 focus:outline-brand-primary"
          />
        </div>

        <div class="my-6">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="my-1 flex w-96 rounded border-2 border-gray-light p-2 focus:outline-brand-primary"
          />
        </div>

        <p
          v-show="showLoginError"
          class="w-96 rounded-2xl bg-red-100 p-2 text-base font-semibold text-red-700"
        >
          Veuillez vérifier vos identifiants.
        </p>

        <button
          type="submit"
          class="rounded-lg bg-brand-primary p-2 text-brand-secondary hover:bg-brand-primary-dark"
        >
          Me connecter
        </button>

        <nuxt-link
          :to="'/user/password-reset'"
          class="text-end hover:text-gray-light"
        >
          Mot de passe oublié ?
        </nuxt-link>
      </form>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/User'
import { useNavigationStore } from '@/stores/Navigation'

export default {
  data() {
    return {
      email: '',
      password: '',
      showLoginError: false,
      nav: useNavigationStore(),
    }
  },
  mounted() {
    this.nav.loading = false
  },
  methods: {
    async login() {
      try {
        this.nav.loading = 'full'
        await useUserStore().login(this.email, this.password)
        await useRouter().replace('/')
      } catch (e) {
        this.showLoginError = true
        this.nav.loading = false
      }
    },
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
