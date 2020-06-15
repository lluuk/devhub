<template>
  <section class="text-gray-500 bg-gray-900 body-font overflow-hidden">
    <div class="container px-5 py-24 mx-auto">
      <div v-if="jobs && jobs.length" class="-my-8">
        <job-item v-for="job in jobs" :key="job.id" :job="job" />
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import JobItem from '~/components/JobItem'
export default {
  components: {
    JobItem
  },

  async asyncData({ store }) {
    await store.dispatch('jobs/fetchJobs')
  },

  computed: {
    ...mapState({
      jobs: (state) => state.jobs.jobs
    })
  }
}
</script>
