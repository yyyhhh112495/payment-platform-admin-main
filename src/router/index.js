import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}
const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "Frame" */ '../layout/Layout.vue'),
    meta: { title: '框架页' },
    children: [
      {
        path: '/404',
        component: () => import(/* webpackChunkName: "404" */ '../views/404.vue'),
        meta: {
          title: '404',
          noKeepAlive: true
        }
      },
      {
        path: '/403',
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
        meta: {
          title: '403',
          noKeepAlive: true
        }
      },
      {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "Dashboard" */ '../views/Dashboard.vue'),
        meta: {
          title: '工作台'
        }
      },
      {
        path: '/shopmanager',
        component: () => import(/* webpackChunkName: "ShopManager" */ '../views/common/ShopManager.vue'),
        meta: {
          title: '商户维护'
        }
      },
      {
        path: '/accountmanager',
        component: () => import(/* webpackChunkName: "AccountManager" */ '../views/common/AccountManager.vue'),
        meta: {
          title: '收款账号设置'
        }
      },
      {
        path: '/shopordermanager',
        component: () => import(/* webpackChunkName: "ShopOrderManager" */ '../views/common/ShopOrderManager.vue'),
        meta: {
          title: '商户订单明细查询'
        }
      },
      {
        path: '/ordermanager',
        component: () => import(/* webpackChunkName: "OrderManager" */ '../views/common/OrderManager.vue'),
        meta: {
          title: '订单明细查询'
        }
      },
      {
        path: '/withdrawmanager',
        component: () => import(/* webpackChunkName: "WithdrawManager" */ '../views/common/WithdrawManager.vue'),
        meta: {
          title: '提现'
        }
      },
      {
        path: '/shopwithdrawmanager',
        component: () => import(/* webpackChunkName: "ShopWithdrawManager" */ '../views/common/ShopWithdrawManager.vue'),
        meta: {
          title: '商户提现'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  routes
})

export default router
