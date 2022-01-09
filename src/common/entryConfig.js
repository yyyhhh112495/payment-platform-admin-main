import _ from 'lodash'
import moment from 'moment'
import '@/styles/index.less'
import 'nprogress/nprogress.css'
import global from '@/global/index.js'
import {
  Button,
  Icon,
  Row,
  Col,
  Layout,
  Dropdown,
  Menu,
  DatePicker,
  Form,
  FormModel,
  Input,
  Select,
  Checkbox,
  Avatar,
  Table,
  Tag,
  Tooltip,
  message,
  Modal,
  ConfigProvider,
  Drawer,
  Result,
  Switch,
  Breadcrumb,
  InputNumber,
  Tabs,
  Tree,
  Timeline,
  Divider,
  Card,
  Radio,
  Cascader,
  Popconfirm,
  Popover,
  Notification,
  Collapse,
  Descriptions,
  Upload,
  Statistic
} from 'ant-design-vue'

export default (Vue) => {
  Vue.use(Button)
  Vue.use(Icon)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Layout)
  Vue.use(Dropdown)
  Vue.use(Menu)
  Vue.use(DatePicker)
  Vue.use(Form)
  Vue.use(FormModel)
  Vue.use(Input)
  Vue.use(Select)
  Vue.use(Checkbox)
  Vue.use(Avatar)
  Vue.use(Table)
  Vue.use(Tag)
  Vue.use(Tooltip)
  Vue.use(Modal)
  Vue.use(ConfigProvider)
  Vue.use(Drawer)
  Vue.use(Result)
  Vue.use(Switch)
  Vue.use(Breadcrumb)
  Vue.use(InputNumber)
  Vue.use(Tabs)
  Vue.use(Tree)
  Vue.use(Timeline)
  Vue.use(Divider)
  Vue.use(Card)
  Vue.use(Radio)
  Vue.use(Cascader)
  Vue.use(Popconfirm)
  Vue.use(Popover)
  Vue.use(Notification)
  Vue.use(Collapse)
  Vue.use(Descriptions)
  Vue.use(Upload)
  Vue.use(Statistic)
  Vue.prototype.$confirm = Modal.confirm
  Vue.prototype.$message = message
  Vue.prototype.$info = Modal.info
  Vue.prototype.$success = Modal.success
  Vue.prototype.$error = Modal.error
  Vue.prototype.$warning = Modal.warning
  Vue.prototype.$destroyAll = Modal.destroyAll
  Vue.prototype.$notification = Notification

  Vue.config.productionTip = false
  Vue.prototype.$_ = _
  Vue.prototype.$moment = moment
  Vue.prototype.$global = global
}
