import axios from 'axios'
import store from '@/store'
import { Notification, Modal } from 'ant-design-vue'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 60000 // request timeout
})

service.interceptors.request.use(
  config => {
    let token = store.state.user.token
    let userid = store.state.user.userInfo.userid
    if (token) {
      config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
      config.headers.TellerID = userid
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.retCode === '2' || res.retCode === '3') {
      Modal.error({
        title: '错误',
        content: res.retMsg || 'Error',
        keyboard: false,
        closable: false,
        maskClosable: false,
        onOk () {
          store.commit('frame/setPanes', [])
          store.commit('user/setUserInfo', '')
          store.commit('user/setToken', '')
          router.replace({ path: '/login' })
        }
      })
    } else if (res.retCode !== '1') {
      Notification.error({
        message: '错误',
        description: res.retMsg || 'Error'
      })
      return Promise.reject(new Error(res.retMsg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (error.response && parseInt(error.response.status) !== 200) {
      Notification.error({
        message: error.response.status,
        description: error.response.config.url
      })
    }
    return Promise.reject(error)
  }
)

export default service
