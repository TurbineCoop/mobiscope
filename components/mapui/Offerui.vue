<template>
  <div>
    <div
      class="z-1000 top-18 absolute right-0 mt-1 w-1/3 bg-brand-secondary py-4"
    >
      <Crossleft
        class="ml-2 cursor-pointer"
        @click="jobs.selected ? (jobs.selected = null) : $emit('close')"
      />
    </div>

    <div
      v-if="jobs.selected?.origineOffre?.urlOrigine"
      class="z-1100 absolute bottom-0 right-0 mt-1 flex w-1/3 gap-2 bg-brand-secondary p-3"
    >
      <button class="rounded-xl bg-brand-primary p-4">
        <Print @click="jobs.printOffer()" />
      </button>
      <button class="rounded-xl bg-brand-primary p-4">
        <Email @click="jobs.emailOffer(user.email)" />
      </button>
      <a
        :href="jobs.selected?.origineOffre?.urlOrigine"
        target="_blank"
        rel="noopener noreferrer"
        class="rounded-xl bg-brand-primary p-4 pt-5"
      >
        <Goarrow />
      </a>
    </div>
  </div>
</template>

<script>
import Crossleft from '../assets/Crossleft.svg'
import Print from '../assets/Print.svg'
import Email from '../assets/Email.svg'
import Goarrow from '../assets/Goarrow.svg'
import { useJobsStore } from '@/stores/Jobs'
import { useUserStore } from '@/stores/User'

export default {
  components: { Crossleft, Print, Email, Goarrow },
  data() {
    return {
      jobs: useJobsStore(),
      user: useUserStore(),
    }
  },
}
</script>

<style scoped>
* {
  transition: 0.2s;
}
</style>
