import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'

const initialState = () => ({
  id: NaN,
  email: '',
  firstName: '',
  lastName: '',
  beneficiaries: [],
  jwt: '',
})

export const useUserStore = defineStore('user', {
  state: () => useLocalStorage('userState', initialState()),
  actions: {
    async updateBenefs() {
      try {
        const benefs = await $fetch('/api/beneficiaries/all')
        if (benefs.length) {
          this.beneficiaries = benefs
        }
        return benefs
      } catch (e) {
        this.logout()
        return []
      }
    },
    async login(email, password) {
      // TODO: API route for logout
      const user = await $fetch('/api/user/login', {
        method: 'post',
        body: {
          email,
          password,
        },
      })

      if (user.error) {
        throw user.error
      }

      const { cookies } = useCookies()
      cookies.set('authorization', user.jwt)

      this.id = user.id
      this.email = user.email
      this.firstName = user.firstName
      this.lastName = user.lastName

      this.jwt = user.jwt

      const benefs = await $fetch('/api/beneficiaries/all')
      if (benefs.length) {
        this.beneficiaries = benefs
      }
    },
    logout() {
      const { cookies } = useCookies()
      cookies.remove('authorization')
      Object.assign(this, initialState())
    },
    async askResetToken(email) {
      return await $fetch('/api/user/ask-reset', {
        method: 'post',
        body: { email },
      })
    },
    async resetPassword(token, password) {
      return await $fetch('/api/user/password-reset', {
        method: 'post',
        body: { token, password },
      })
    },
    async test() {
      return await $fetch('/api/user/test')
    },
    async addBenef(benef) {
      const res = await $fetch('/api/beneficiaries/add', {
        method: 'post',
        body: benef,
      })
      if (res.error) {
        return res
      }

      this.beneficiaries = res
      return res
    },
    async editBenef(benef) {
      delete benef.points
      const res = await $fetch('/api/beneficiaries/edit', {
        method: 'post',
        body: benef,
      })
      if (res.error) {
        return res
      }

      this.beneficiaries = await this.updateBenefs()
      return res
    },
    async deleteBenef(id) {
      const res = await $fetch('/api/beneficiaries/remove', {
        method: 'post',
        body: { benefId: id },
      })
      if (res.error) {
        return res
      }

      await this.updateBenefs()
    },
    sortBenefsBy(opt) {
      this.beneficiaries.sort((a, b) => {
        if (!a[opt.attr]) return +1
        if (!b[opt.attr]) return -1

        return a[opt.attr].localeCompare(b[opt.attr])
      })

      if (!opt.increasing) {
        this.beneficiaries.reverse()
      }
    },
  },
})
