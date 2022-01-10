import request from '@/utils/request'

const api = {
  queryOrgInfo: '/jpysers/queryOrgInfo',
  optOrgInfo: '/jpysers/optOrgInfo',
  queryCountInfo: '/jpysers/queryCountInfo',
  optCountInfo: '/jpysers/optCountInfo',
  queryTaskInfo: '/jpysers/queryTaskInfo',
  queryTransInfo: '/jpysers/queryTransInfo',
  optTasks: '/jpysers/optTasks',
  queryTransCon: '/jpysers/queryTransCon',
  optTransByNo: '/jpysers/optTransByNo',
  queryTaskTrans: '/jpysers/queryTaskTrans',
  queryTaskTransByBusId: '/jpysers/queryTaskTransByBusId',
  optJsTask: '/jpysers/optJsTask',
  delRecords: '/jpysers/delRecords'
}

export function queryOrgInfo (data) {
  return request({
    url: api.queryOrgInfo,
    method: 'post',
    data: data
  })
}
export function optOrgInfo (data) {
  return request({
    url: api.optOrgInfo,
    method: 'post',
    data: data
  })
}
export function queryCountInfo (data) {
  return request({
    url: api.queryCountInfo,
    method: 'post',
    data: data
  })
}
export function optCountInfo (data) {
  return request({
    url: api.optCountInfo,
    method: 'post',
    data: data
  })
}
export function queryTaskInfo (data) {
  return request({
    url: api.queryTaskInfo,
    method: 'post',
    data: data
  })
}
export function queryTransInfo (data) {
  return request({
    url: api.queryTransInfo,
    method: 'post',
    data: data
  })
}
export function optTasks (data) {
  return request({
    url: api.optTasks,
    method: 'post',
    data: data
  })
}
export function queryTransCon (data) {
  return request({
    url: api.queryTransCon,
    method: 'post',
    data: data
  })
}
export function optTransByNo (data) {
  return request({
    url: api.optTransByNo,
    method: 'post',
    data: data
  })
}
export function queryTaskTrans (data) {
  return request({
    url: api.queryTaskTrans,
    method: 'post',
    data: data
  })
}
export function queryTaskTransByBusId (data) {
  return request({
    url: api.queryTaskTransByBusId,
    method: 'post',
    data: data
  })
}
export function optJsTask (data) {
  return request({
    url: api.optJsTask,
    method: 'post',
    data: data
  })
}
export function delRecords (data) {
  return request({
    url: api.delRecords,
    method: 'post',
    data: data
  })
}
