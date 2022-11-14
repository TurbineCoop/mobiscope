import { defineStore } from 'pinia'
import { useBenefStore } from '~/stores/Benef'

export const usePointStore = defineStore('points', {
  state: () => {
    return {
      points: [],
    }
  },
  actions: {
    async loadPoints(benefId) {
      this.points = await $fetch('/api/points/list?benefId=' + benefId)
    },
    addPoint(point) {
      return $fetch('/api/points/add', {
        method: 'post',
        body: {
          benefId: useBenefStore().id,
          ...point,
        },
      })
    },
    updatePoint(point) {
      delete point.traces
      return $fetch('/api/points/update', {
        method: 'post',
        body: {
          benefId: useBenefStore().id,
          ...point,
        },
      })
    },
    removePoint(id) {
      return $fetch('/api/points/remove', {
        method: 'post',
        body: {
          benefId: useBenefStore().id,
          pointId: id,
        },
      })
    },
    async loadPointsTrip(dep) {
      dep = Object.values(dep)

      await this.points.map(async (point) => {
        point.traces = await $fetch(
          `/api/integrations/trip?departure=${dep.join(
            '-'
          )}&arrival=${point.location.join('-')}&fullData=true`
        )
        return point
      })
    },
    modifyPoints(newPoints) {
      this.points = newPoints
    },
  },
  getters: {
    isoCount() {
      return this.points.length - 1
    },
  },
})
