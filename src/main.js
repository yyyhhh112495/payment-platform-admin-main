import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import entryConfig from './common/entryConfig'
import NProgress from 'nprogress'
// 调用公共方法加载配置
entryConfig(Vue)

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  NProgress.start()
  const userInfo = store.state.user.userInfo
  if (!userInfo && to.path !== '/login') {
    if (from.path === '/login') {
      NProgress.done()
    }
    next('/login')
  } else if (to.meta.key && userInfo.ruleCde.indexOf(to.meta.key) === -1) {
    if (from.path === '/403') {
      NProgress.done()
    }
    next('/403')
  } else {
    next()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeResolve((to, from, next) => {
  vm.$destroyAll()
  next()
})
