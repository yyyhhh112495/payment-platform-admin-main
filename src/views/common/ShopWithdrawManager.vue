<template>
  <div class="page" ref="page">
    <div class="box">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="商户名称">
                <a-input v-model="queryParam.bussinessname" allowClear autocomplete="off" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="结算状态">
                <a-select v-model="queryParam.transtatus" allowClear placeholder="请选择">
                  <a-select-option v-for="(label, value) in $global.syscode.TRANSSTATUS" :key="value" :value="value">{{label}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="">
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" :loading="loading" @click="query()">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="advanced = !advanced" style="margin-left: 8px; display: none">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-row :gutter="[0, 48]">
        <a-col :span="4">
          <a-statistic title="可提现金额" :value="jsbefore">
            <template #suffix>
              <span> 元</span>
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="4">
          <a-statistic title="提现中金额" :value="jsingnum">
            <template #suffix>
              <span> 元</span>
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="4">
          <a-statistic title="已提现金额" :value="jsednum">
            <template #suffix>
              <span> 元</span>
            </template>
          </a-statistic>
        </a-col>
      </a-row>
      <div style="text-align: right;">
        <a-button style="margin-bottom: 16px;margin-right: 16px;" type="dashed" icon="export" @click="exportExcel">导出</a-button>
        <a-button style="margin-bottom: 16px;" type="dashed" icon="flag" @click="apply">申请结算</a-button>
      </div>
      <a-table
        size="middle"
        :columns="columns"
        :dataSource="dataList"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: true }"
        @change="query"
      >
        <span slot="transtatus" slot-scope="record">
          <a-tag
            :color="record == '1' ? 'green' : ''">
            {{$global.syscode.TRANSSTATUS[record]}}
          </a-tag>
        </span>
      </a-table>
    </div>
    <a-modal
      title="申请结算"
      v-model="visible"
      destroyOnClose
    >
      <template slot="footer">
        <a-button type="primary" @click="handleOk">提交</a-button>
      </template>
      <a-form :form="form" class="form" style="padding:0 20px">
        <a-row :gutter="$global.drawerFormGrid.gutter">
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="开户行">
              <a-input
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'countbankname',
                  {
                    rules: [
                      { required: true, message: '请输入开户行'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="开户记名">
              <a-input
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'countname',
                  {
                    rules: [
                      { required: true, message: '请输入开户记名'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="银行卡号">
              <a-input
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'countid',
                  {
                    rules: [
                      { required: true, message: '请输入银行卡号'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="结算金额(元)">
              <a-input-number
                style="width: 100%"
                placeholder="请输入"
                autocomplete="off"
                allowClear
                :min="0"
                :precision="2"
                v-decorator="[
                  'jsnum',
                  {
                    rules: [
                      { required: true, message: '请输入结算金额'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { queryTaskTransByBusId, optTasks } from '@/api/common'
export default {
  name: 'ShopWithdrawManager',
  data () {
    return {
      advanced: false,
      queryParam: {},
      columns: [],
      dataList: [],
      loading: false,
      pagination: this.$global.pagination(),
      visible: false,
      form: this.$form.createForm(this),
      jsbefore: 0,
      jsingnum: 0,
      jsednum: 0
    }
  },
  created () {
    this.columns = [
      {
        dataIndex: 'transbankname',
        title: '收款行'
      },
      {
        dataIndex: 'transcountname',
        title: '户名'
      },
      {
        dataIndex: 'transcountid',
        title: '卡号'
      },
      {
        dataIndex: 'bussinessname',
        title: '商户名称'
      },
      {
        dataIndex: 'jstradeno',
        title: '结算批次号'
      },
      {
        dataIndex: 'jsnum',
        title: '结算金额（元）'
      },
      {
        dataIndex: 'profit',
        title: '利润'
      },
      {
        dataIndex: 'transtatus',
        title: '结算状态',
        scopedSlots: { customRender: 'transtatus' }
      },
      {
        dataIndex: 'jstime',
        title: '申请时间'
      },
      {
        dataIndex: 'transcomtime',
        title: '结算时间'
      }
    ]
    this.query()
  },
  methods: {
    query (pagination) {
      if (!pagination) {
        this.pagination = this.$global.pagination()
      } else {
        this.pagination.current = pagination.current
        this.pagination.pageSize = pagination.pageSize
      }
      this.loading = true
      this.dataList = []
      queryTaskTransByBusId({
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.queryParam
      }).then(response => {
        this.pagination.total = Number(response.retData.total)
        response.retData.list.forEach((el, index) => {
          this.dataList.push({
            key: index,
            ...el
          })
        })
        this.jsbefore = response.retData.jsbefore
        this.jsingnum = response.retData.jsingnum
        this.jsednum = response.retData.jsednum
      }).finally(() => {
        this.loading = false
      })
    },
    apply () {
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$store.commit('frame/setSpinning', true)
          optTasks({
            ...values
          }).then(response => {
            this.$message.success('申请成功')
            this.query()
            this.visible = false
          }).finally(() => {
            this.$store.commit('frame/setSpinning', false)
          })
        }
      })
    },
    exportExcel () {
      this.$store.commit('frame/setSpinning', true)
      queryTaskTransByBusId({
        ...this.queryParam,
        export: '1'
      }).then(response => {
        window.open(response.retData.filename)
      }).finally(() => {
        this.$store.commit('frame/setSpinning', false)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page{
  padding: 16px;
  .box{
    padding: 24px;
  }
}
</style>
