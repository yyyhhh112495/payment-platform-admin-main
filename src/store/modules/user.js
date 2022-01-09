const state = {
  userInfo: '',
  token: ''
}

const mutations = {
  setUserInfo (state, data) {
    state.userInfo = data
  },
  setToken (state, data) {
    state.token = data
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
