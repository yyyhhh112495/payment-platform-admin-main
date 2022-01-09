import request from '@/utils/request'

const api = {
  login: '/jpysers/userlogin',
  logout: '/jpysers/userExit',
  getVerPic: '/jpysers/getVerPic',
  chgPasswd: '/jpysers/chgPasswd',
  restPasswd: '/jpysers/restPasswd'
}

export function login (data) {
  return request({
    url: api.login,
    method: 'post',
    data: data
  })
}
export function getVerPic (data) {
  return request({
    url: api.getVerPic,
    method: 'post',
    data: data
  })
}
export function logout (data) {
  return request({
    url: api.logout,
    method: 'post',
    data: data
  })
}
export function chgPasswd (data) {
  return request({
    url: api.chgPasswd,
    method: 'post',
    data: data
  })
}
export function restPasswd (data) {
  return request({
    url: api.restPasswd,
    method: 'post',
    data: data
  })
}
