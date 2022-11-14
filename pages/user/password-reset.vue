<template>
  <div class="flex h-screen w-full justify-center bg-brand-primary-dark">
    <form
      v-if="token"
      class="my-auto flex flex-col space-y-6 rounded-xl bg-brand-secondary p-10 text-xl"
      @submit.prevent="login"
    >
      <h1 class="mb-6 flex justify-center text-2xl font-bold">
        Nouveau Mot de passe
      </h1>
      <div>
        <label for="password1">Mot de passe</label>
        <input
          id="password1"
          v-model="newPassword"
          type="password"
          placeholder="Minimum 8 caractères."
          class="my-1 flex w-full rounded border-2 border-gray-light p-2 focus:outline-brand-primary"
        />
        <label for="password1">Confirmation du mot de passe</label>
        <input
          id="password2"
          v-model="newPasswordConfirm"
          type="password"
          placeholder="Minimum 8 caractères."
          class="my-1 flex w-full rounded border-2 border-gray-light p-2 focus:outline-brand-primary"
        />
      </div>

      <p
        v-show="!isPasswordValid"
        class="w-96 rounded-2xl bg-red-100 p-2 text-base font-semibold text-red-700"
      >
        Le mot de passe est trop faible ou ne correspond pas.
      </p>

      <button
        type="submit"
        :disabled="!isPasswordValid"
        class="rounded-lg bg-brand-primary p-2 text-brand-secondary"
        :class="
          !isPasswordValid
            ? 'cursor-not-allowed'
            : ' hover:bg-brand-primary-dark '
        "
        @click="sendResetPassword"
      >
        Changer mon mot de passe
      </button>
    </form>
    <form
      v-else-if="!sent"
      class="my-auto flex flex-col space-y-6 rounded-xl bg-brand-secondary p-10 text-xl"
      @submit.prevent="login"
    >
      <h1 class="mb-6 flex justify-center text-2xl font-bold">
        Recevez un lien de réinitialisation par mail
      </h1>
      <div>
        <label for="mail">Email</label>
        <input
          id="mail"
          v-model="email"
          type="email"
          placeholder="exemple@domain.com"
          class="my-1 flex w-full rounded border-2 border-gray-light p-2 focus:outline-brand-primary"
        />
      </div>

      <p
        v-show="isPasswordValid"
        class="w-96 rounded-2xl bg-red-100 p-2 text-base font-semibold text-red-700"
      >
        Cettre adresse mail est incorrect ou n'existe pas.
      </p>

      <button
        type="submit"
        class="rounded-lg bg-brand-primary p-2 text-brand-secondary hover:bg-brand-primary-dark"
        @click="askResetToken"
      >
        Envoyer
      </button>
    </form>
    <div
      v-else
      class="my-auto flex flex-col space-y-6 rounded-xl bg-brand-secondary p-10 text-xl"
    >
      <h1 class="mx-auto text-4xl font-bold">Mail envoyé !</h1>
      <p>Rendez-vous dans votre boite mail puis suivez les instructions.</p>

      <Check class="mx-auto w-80 fill-brand-primary" />
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../../stores/User'
import Check from '../../components/assets/Check.svg'

export default {
  components: { Check },
  data() {
    return {
      email: '',
      sent: false,
      user: useUserStore(),
      error: false,
      token: '',
      newPassword: '',
      newPasswordConfirm: '',
    }
  },
  computed: {
    isPasswordValid() {
      return (
        this.newPassword === this.newPasswordConfirm &&
        this.newPassword.length >= 7
      )
    },
  },
  mounted() {
    if (this.$route.query.token) this.token = this.$route.query.token
    if (this.$route.query.fromDash) {
      this.email = this.user.email
      this.askResetToken()
    }
  },
  methods: {
    async askResetToken() {
      this.sent = await this.user.askResetToken(this.email)
    },
    async sendResetPassword() {
      const success = await this.user.resetPassword(
        this.token,
        this.newPassword
      )
      if (success) {
        return await navigateTo('/user/login', { replace: true })
      } else {
        this.error = true
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
