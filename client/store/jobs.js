export const state = () => ({
  jobs: []
})

export const mutations = {
  updateJobs(state, jobs) {
    state.jobs = jobs
  }
}

export const actions = {
  async fetchJobs({ commit }) {
    try {
      const { data } = await this.$axios.get('api/jobs')
      commit('updateJobs', data)
    } catch (e) {
      commit('updateJobs', [])
    }
  }
}
