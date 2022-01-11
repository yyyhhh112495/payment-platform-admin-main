const STATUS = {
  1: '生效',
  0: '失效'
}
const STATUS2 = {
  1: '已启用',
  0: '未启用'
}
const TRANSSTATUS = {
  0: '结算中',
  1: '已结算'
}
const ORDERSTATUS = {
  0: '未支付',
  1: '已支付'
}
const PAYCHANEL = {
  wepay: '微信',
  alipay: '支付宝'
}
const RSPRET = {
  0: '失败',
  1: '成功'
}
export default {
  STATUS,
  STATUS2,
  TRANSSTATUS,
  ORDERSTATUS,
  PAYCHANEL,
  RSPRET
}
