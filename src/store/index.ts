import { request } from '@/utils'
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      token: null,
    }
  },

  mutations: {
    setToken(state, data) {
      state.token = data
    },
  },

  actions: {
    //获取用户个人信息
    async getUserProfile(context) {
      if (!context.state.token) return

      // await request({
      //   url: '%YQS%/dragon/user/get_user_profile',
      //   data: {
      //     token: true,
      //   },
      // })
    },
  },
})

export default store
