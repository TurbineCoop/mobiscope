import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('Navigation', {
  state: () => {
    return {
      pageTitle: '',
      sidebarOpened: false,
      search: false,
      loading: false,
      printNode: '',
      invalidMap: true,
    }
  },
  actions: {
    updatePage(page) {
      this.$reset()
      this.pageTitle = page.title
    },
    toggleSidebar() {
      this.sidebarOpened = !this.sidebarOpened
    },
    toggleSearch() {
      this.search = !this.search
      this.pageTitle = this.search
        ? 'Démarrer une recherche'
        : 'Consulter mes possibles'
    },
  },
})
