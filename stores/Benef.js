import { defineStore } from 'pinia'
import { usePointStore } from '~/stores/Points'

export const useBenefStore = defineStore('benef', {
  state: () =>
    useLocalStorage('currentBeneficiary', {
      id: 0,
      firstName: '',
      lastName: '',
      activitySector: '',
      sectorCode: '',
    }),
  actions: {
    setBenef(benef) {
      this.id = benef.id
      this.firstName = benef.firstName
      this.lastName = benef.lastName
      this.activitySector = benef.activitySector
      this.sectorCode = benef.sectorCode
    },
  },
  getters: {
    points() {
      return usePointStore().points.filter((p) => p.benefId === this.id)
    },
  },
})
