import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //首页
    {
      path: '/',
      redirect: {
        name: 'about',
      },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
    },
  ],
})

//路由守卫
router.beforeEach(async (to, from, next) => {
  // let token = to.query.token || store.state.token
  // if (token) {
  //   store.commit('setToken', token)
  // }

  next()
})

export default router
