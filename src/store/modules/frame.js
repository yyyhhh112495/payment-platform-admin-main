const state = {
  panes: [],
  spinning: false
}

const mutations = {
  setPanes (state, data) {
    state.panes = data
  },
  setSpinning (state, data) {
    state.spinning = data
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
