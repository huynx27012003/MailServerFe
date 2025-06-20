import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      isAuthenticated: false,
      user: null,
      serverAddr: localStorage.getItem('SERVER_ADDR') || 'http://localhost:8000'
    }
  },
  mutations: {
    setAuthenticated(state, value) {
      state.isAuthenticated = value
    },
    setUser(state, user) {
      state.user = user
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
    },
    setServerAddr(state, addr) {
      state.serverAddr = addr
      localStorage.setItem('SERVER_ADDR', addr)
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    role: state => state.user?.role || null,
  }
})

export default store