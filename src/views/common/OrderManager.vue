<template>
  <div class="page" ref="page">
    <div class="box">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="流水号">
                <a-input v-model="queryParam.tradeno" allowClear autocomplete="off" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商户名称">
                <a-input v-model="queryParam.bussinessname" allowClear autocomplete="off" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订单状态">
                <a-select v-model="queryParam.payres" allowClear placeholder="请选择">
                  <a-select-option v-for="(label, value) in $global.syscode.ORDERSTATUS" :key="value" :value="value">{{label}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
                <a-form-item class="mydate" label="开始时间" >
                  <div>
                      <a-date-picker
                        v-model="queryParam.startdate"
                        type="date"
                        placeholder="开始时间"
                        style="width: 100%;"
                        value-format="yyyy/MM/DD"
                        />
                  </div>
              </a-form-item>
            </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item class="mydate" label="结束时间" >
                  <div>
                      <a-date-picker
                        v-model="queryParam.enddate"
                        type="date"
                        placeholder="结束时间"
                        style="width: 100%;"
                        value-format="yyyy/MM/DD 25:00:00"
                        />
                  </div>
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
        </a-col>
        <a-col :span="4">
          <a-statistic title="已结算利润" :value="profitednum">
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
          <a-statistic title="待结算金额" :value="transnum">
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
          <a-statistic title="利润" :value="profitnum">
            <template #suffix>
              <span> 元</span>
            </template>
          </a-statistic>
        </a-col> -->
      </a-row>
      <div style="text-align: right;">
        <a-button style="margin-bottom: 16px;margin-right: 16px;" type="dashed" icon="export" @click="exportExcel">导出</a-button>
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
      <span slot="action" slot-scope="record">
          <a @click="handleCallBack(record)">通知下游</a>
           <a-divider type="vertical" />
          <a @click="handleQuery(record)">获取状态</a>
        </span>
        <span slot="payres" slot-scope="record">
          <a-tag
            :color="record == '1' ? 'green' : record == '0' ? 'red' : ''">
            {{$global.syscode.ORDERSTATUS[record]}}
          </a-tag>
        </span>
        <!-- <span slot="action" slot-scope="record" v-if="record.transstatus === '2'">
          <a @click="confirm(record)">确认结算</a>
        </span> -->
      </a-table>
    </div>
  </div>
</template>

<script>
import { queryTransInfo, queryTransCon, optTransByNo, notifyChannelByTradeno, queryPayResBytradeno } from '@/api/common'
export default {
  name: 'OrderManager',
  data () {
    return {
      advanced: false,
      queryParam: {},
      columns: [],
      dataList: [],
      loading: false,
      pagination: this.$global.pagination(),
      tradednum: 0,
      transednum: 0,
      profitednum: 0,
      tradenum: 0,
      transnum: 0,
      profitnum: 0,
      totalpay: 0,
      jsnum: 0,
      paysuc: 0,
      payfai: 0,
      startdate: undefined,
      enddate: undefined
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
        dataIndex: 'bussratio',
        title: '商户费率（%）'
      },
      {
        dataIndex: 'tradenum',
        title: '客户支付金额'
      },
      {
        dataIndex: 'transprofit',
        title: '利润'
      },
      {
        dataIndex: 'transnum',
        title: '结算金额'
      },
      {
        dataIndex: 'paytime',
        title: '支付时间'
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        scopedSlots: { customRender: 'action' },
        width: 120,
        align: 'center'
      }
      // {
      //   dataIndex: 'transno',
      //   title: '结算批次'
      // },
      // {
      //   title: '操作',
      //   key: 'action',
      //   fixed: 'right',
      //   scopedSlots: { customRender: 'action' },
      //   width: 120,
      //   align: 'center'
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
      queryTransInfo({
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
        this.profitednum = response.retData.profitednum
        this.tradenum = response.retData.tradenum
        this.transnum = response.retData.transnum
        this.profitnum = response.retData.profitnum
        this.totalpay = response.retData.totalpay
        this.jsnum = response.retData.jsnum
        this.paysuc = response.retData.paysuc
        this.payfai = response.retData.payfai
      }).finally(() => {
        this.loading = false
      })
    },
    confirm (record) {
      this.$store.commit('frame/setSpinning', true)
      queryTransCon({
        transno: record.transno
      }).then(response => {
        let bussinessname = response.retData.bussinessname
        let totalmon = response.retData.totalmon
        let transno = response.retData.transno
        this.$confirm({
          title: h => {
            return (
              <div>
                <div>是否确认结算</div>
                <div>商户：<span style="color:red;">{bussinessname}</span></div>
                <div>流水号：<span style="color:red;">{transno}</span></div>
                <div>总金额：<span style="color:red;">{totalmon}</span></div>
                下的业务吗？
              </div>
            )
          },
          onOk () {
            this.$store.commit('frame/setSpinning', true)
            optTransByNo({
              transno: record.transno
            }).then(response => {
              this.$message.success('结算成功')
              this.query()
            }).finally(() => {
              this.$store.commit('frame/setSpinning', false)
            })
          }
        })
      }).finally(() => {
        this.$store.commit('frame/setSpinning', false)
      })
    },
    exportExcel () {
      this.$store.commit('frame/setSpinning', true)
      queryTransInfo({
        ...this.queryParam,
        export: '1'
      }).then(response => {
        window.open(response.retData.filename)
      }).finally(() => {
        this.$store.commit('frame/setSpinning', false)
      })
    },
    handleCallBack (record) {
      notifyChannelByTradeno({
        ...this.queryParam,
        tradeno: record.tradeNo
      }).then(response => {
        this.query()
      }).finally(() => {
        this.loading = false
      })
    },
    handleQuery (record) {
      queryPayResBytradeno({
        ...this.queryParam,
        tradeno: record.tradeNo
      }).then(response => {
        this.query()
      }).finally(() => {
        this.loading = false
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
