<template>
  <section class="text-gray-500 bg-gray-900 body-font overflow-hidden">
    <div class="container px-5 py-24 mx-auto">
      <div class="-my-8">
        <job-item v-for="job in jobs" :key="job.id" :job="job" />
      </div>
    </div>
  </section>
</template>

<script>
import JobItem from '~/components/JobItem'
export default {
  components: {
    JobItem
  },

  async asyncData(context) {
    const { data } = await context.$axios.get('api/jobs')
    return { jobs: data }
  }
}
</script>
