<template>
  <div class="py-8 flex flex-wrap md:flex-no-wrap">
    <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col mr-3">
      <span class="tracking-widest font-medium title-font text-white">
        <img :src="job.image" alt="" style="max-height:100px; width: auto;"
      /></span>
      <span v-if="job.date" class="mt-1 text-gray-600 text-sm">{{
        job.date
      }}</span>
    </div>
    <div class="md:flex-grow">
      <h2 class="text-2xl font-medium text-white title-font mb-2">
        {{ job.title }}
      </h2>
      <p class="leading-relaxed">Company: {{ job.company }}</p>
      <p class="leading-relaxed">Location: {{ job.location }}</p>
      <div v-if="job.tags.length" class="py-4">
        <span
          v-for="tag in job.tags"
          :key="tag"
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          >{{ tag }}</span
        >
      </div>
      <a
        class="text-indigo-500 inline-flex items-center mt-4"
        target="_blank"
        :href="job.link"
        >Check More
        <svg
          class="w-4 h-4 ml-2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14"></path>
          <path d="M12 5l7 7-7 7"></path>
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    job: {
      type: Object,
      required: true
    }
  }
}
</script>
