<template>
  <div class="page" ref="page">
    <div class="box">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="流水号">
                <a-input v-model="queryParam.tradeNo" allowClear autocomplete="off" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="商户名称">
                <a-input v-model="queryParam.bussinessname" allowClear autocomplete="off" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="订单状态">
                <a-select v-model="queryParam.payres" allowClear placeholder="请选择">
                  <a-select-option v-for="(label, value) in $global.syscode.ORDERSTATUS" :key="value" :value="value">{{label}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="">
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 6 || 24" :sm="24">
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
        <!-- <a-col :span="4">
          <a-statistic title="已结算支付金额" :value="tradednum">
            <template #suffix>
              <span> 元</span>
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="4">
          <a-statistic title="已结算结算金额" :value="transednum">
            <template #suffix>
              <span> 元</span>
            </template>
          </a-statistic>
        </a-col> -->
        <a-col :span="4">
          <a-statistic title="支付金额" :value="totalpay">
            <template #suffix>
              <span> 元</span>
            </template>
          </a-statistic>
        </a-col>
        <!-- <a-col :span="4">
          <a-statistic title="未结算金额" :value="jsnum">
            <template #suffix>
              <span> 元</span>
            </template>
          </a-statistic>
        </a-col> -->
        <a-col :span="4">
          <a-statistic title="成功订单笔数" :value="paysuc">
            <template #suffix>
              <span> 笔</span>
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="4">
          <a-statistic title="失败订单笔数" :value="payfai">
            <template #suffix>
              <span> 笔</span>
            </template>
          </a-statistic>
        </a-col>
        <!-- <a-col :span="4">
          <a-statistic title="待结算金额" :value="transnum2">
            <template #suffix>
              <span> 元</span>
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="4">
          <a-statistic title="已选择支付金额" :value="tradenum">
            <template #suffix>
              <span> 元</span>
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="4">
          <a-statistic title="已选择未结算金额" :value="transnum">
            <template #suffix>
              <span> 元</span>
            </template>
          </a-statistic>
        </a-col> -->
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
        <!-- :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps: getCheckboxProps }" -->
        <span slot="payres" slot-scope="record">
          <a-tag
            :color="record == '1' ? 'green' : record == '0' ? 'red' : ''">
            {{$global.syscode.ORDERSTATUS[record]}}
          </a-tag>
        </span>
        <span slot="transstatus" slot-scope="record">
          <a-tag
            :color="record == '3' ? 'green' : record == '2' ? 'blue' : ''">
            {{$global.syscode.TRANSSTATUS[record]}}
          </a-tag>
        </span>
        <span slot="payChanel" slot-scope="record">
          <a-tag
            :color="record == 'wepay' ? 'green' : record == 'alipay' ? 'blue' : ''">
            {{$global.syscode.PAYCHANEL[record]}}
          </a-tag>
        </span>
        <!-- <span slot="payAccount" slot-scope="record"> {{record }} </span> -->
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
import { queryTaskInfo, optTasks } from '@/api/common'
import { accAdd } from '@/utils/tool.js'
export default {
  name: 'ShopOrderManager',
  data () {
    return {
      advanced: false,
      queryParam: {},
      columns: [],
      dataList: [],
      loading: false,
      pagination: this.$global.pagination(),
      selectedRowKeys: [],
      tradenum: 0,
      transnum: 0,
      tradednum: 0,
      transednum: 0,
      totalpay: 0,
      jsnum: 0,
      paysuc: 0,
      payfai: 0,
      visible: false,
      form: this.$form.createForm(this)
    }
  },
  created () {
    this.columns = [
      {
        dataIndex: 'tradeNo',
        title: '流水号'
      },
      {
        dataIndex: 'bussinessname',
        title: '商户名称'
      },
      {
        dataIndex: 'payres',
        title: '订单状态',
        scopedSlots: { customRender: 'payres' }
      },
      {
        dataIndex: 'tradenum',
        title: '客户支付金额（元）'
      },
      // {
      //   dataIndex: 'transnum',
      //   title: '结算金额（元）'
      // },
      {
        dataIndex: 'payChanel',
        title: '支付渠道',
        scopedSlots: { customRender: 'payChanel' }
      },
      {
        dataIndex: 'payAccount',
        title: '支付账户',
        scopedSlots: { customRender: 'payAccount' }
      },
      {
        dataIndex: 'tradegentime',
        title: '支付时间'
      }
      // {
      //   dataIndex: 'transstatus',
      //   title: '结算状态',
      //   scopedSlots: { customRender: 'transstatus' }
      // },
      // {
      //   dataIndex: 'transno',
      //   title: '结算批次'
      // }
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
      this.selectedRowKeys = []
      this.tradenum = 0
      this.transnum = 0
      queryTaskInfo({
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
        this.tradednum = response.retData.tradednum
        this.transednum = response.retData.transednum
        this.totalpay = response.retData.totalpay
        this.jsnum = response.retData.jsnum
        this.paysuc = response.retData.paysuc
        this.payfai = response.retData.payfai
      }).finally(() => {
        this.loading = false
      })
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      let tradenum = 0
      let transnum = 0
      this.selectedRowKeys = selectedRowKeys
      this.selectedRowKeys.forEach(el => {
        tradenum = accAdd(tradenum, Number(this.dataList[el].tradenum) ? Number(this.dataList[el].tradenum) : 0)
        transnum = accAdd(transnum, Number(this.dataList[el].transnum) ? Number(this.dataList[el].transnum) : 0)
      })
      this.tradenum = tradenum
      this.transnum = transnum
    },
    apply () {
      // if (this.selectedRowKeys.length === 0) {
      //   this.$message.warning('请先选中一条')
      //   return
      // }
      // let tradeNo = []
      // this.selectedRowKeys.forEach(el => {
      //   tradeNo.push(this.dataList[el].tradeNo)
      // })
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
      queryTaskInfo({
        ...this.queryParam,
        export: '1'
      }).then(response => {
        window.open(response.retData.filename)
      }).finally(() => {
        this.$store.commit('frame/setSpinning', false)
      })
    },
    getCheckboxProps (record) {
      return {
        props: {
          disabled: record.transstatus === '1' ? false : true
        }
      }
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
