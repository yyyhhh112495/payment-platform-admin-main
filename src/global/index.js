import syscode from '@/global/syscode.js'
import regular from '@/global/regular'
function pagination () {
  return {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total, range) => `第 ${range[0]} - ${range[1]} 条/总共 ${total} 条`,
    pageSizeOptions: ['10', '20', '40', '60', '80']
  }
}
const drawerFormGrid = {
  gutter: 48,
  xl: 6,
  lg: 8,
  md: 12,
  sm: 24
}
export default {
  regular,
  syscode,
  pagination,
  drawerFormGrid
}
