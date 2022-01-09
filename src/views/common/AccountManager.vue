<template>
  <div class="page" ref="page">
    <div class="box">
      <div style="text-align: right;">
        <a-button style="margin-bottom: 16px;" type="dashed" icon="plus" @click="add">新增</a-button>
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
          <a @click="modify(record)">修改</a>
        </span>
        <span slot="countsts" slot-scope="record">
          <a-tag
            :color="record == '1' ? 'green' : record == '0' ? 'red' : ''">
            {{$global.syscode.STATUS2[record]}}
          </a-tag>
        </span>
      </a-table>
    </div>
    <a-modal
      :title="flag == '1' ? '新增' : '修改'"
      v-model="visible"
      destroyOnClose
    >
      <template slot="footer">
        <a-button type="primary" @click="handleOk">提交</a-button>
      </template>
      <a-form :form="form" class="form" style="padding:0 20px">
        <a-form-item v-show="false">
          <a-input v-decorator="['countid']"/>
        </a-form-item>
        <a-row :gutter="$global.drawerFormGrid.gutter">
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="收款账号">
              <a-input
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'countnum',
                  {
                    rules: [
                      { required: true, message: '请输入收款账号'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="收款户名">
              <a-input
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'countname',
                  {
                    rules: [
                      { required: true, message: '请输入收款户名'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="使用状态">
              <a-select
                allowClear
                placeholder="请选择"
                v-decorator="[
                  'countsts',
                  {
                    rules: [
                      { required: true, message: '请选择使用状态'}
                    ]
                  }
                ]">
                <a-select-option v-for="(label, value) in $global.syscode.STATUS2" :key="value" :value="value">{{label}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="最大金额(元)">
              <a-input-number
                style="width: 100%"
                placeholder="请输入"
                autocomplete="off"
                allowClear
                :min="0"
                :precision="2"
                v-decorator="[
                  'countmaxnum',
                  {
                    rules: [
                      { required: true, message: '请输入最大金额'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="最小金额(元)">
              <a-input-number
                style="width: 100%"
                placeholder="请输入"
                autocomplete="off"
                allowClear
                :min="0"
                :precision="2"
                v-decorator="[
                  'countminnum',
                  {
                    rules: [
                      { required: true, message: '请输入最小金额'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="支付宝AppID">
              <a-input
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'aliappid'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="支付宝私钥">
              <a-textarea
                placeholder="请输入"
                autocomplete="off"
                allowClear
                :auto-size="{ minRows: 5, maxRows: 10 }"
                v-decorator="[
                  'alipayprikey'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="支付宝公钥">
              <a-textarea
                placeholder="请输入"
                autocomplete="off"
                allowClear
                :auto-size="{ minRows: 5, maxRows: 10 }"
                v-decorator="[
                  'alipaypukey'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="支付宝费率（%）">
              <a-input-number
                style="width: 100%"
                :disabled="flag == '3'"
                :min="0"
                :max="100"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'alipayration'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="微信AppID">
              <a-input
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'wechatappid'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="微信APIv3秘钥">
              <a-input
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'wechatkey'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="微信商户号（mchid）">
              <a-input
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'wechatmchid'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="微信序列号">
              <a-input
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'wechatmchno'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="微信私钥">
              <a-textarea
                placeholder="请输入"
                autocomplete="off"
                allowClear
                :auto-size="{ minRows: 5, maxRows: 10 }"
                v-decorator="[
                  'wechatprivatekey'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="微信费率（%）">
              <a-input-number
                style="width: 100%"
                :disabled="flag == '3'"
                :min="0"
                :max="100"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'wechatration'
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
import { queryCountInfo, optCountInfo } from '@/api/common'
export default {
  name: 'AccountManager',
  data () {
    return {
      columns: [],
      dataList: [],
      loading: false,
      pagination: this.$global.pagination(),
      visible: false,
      form: this.$form.createForm(this),
      flag: ''
    }
  },
  created () {
    this.columns = [
      {
        dataIndex: 'countnum',
        title: '收款账号'
      },
      {
        dataIndex: 'countname',
        title: '收款户名'
      },
      {
        dataIndex: 'wechatration',
        title: '微信费率（%）'
      },
      {
        dataIndex: 'alipayration',
        title: '支付宝费率（%）'
      },
      {
        dataIndex: 'countsts',
        title: '使用状态',
        scopedSlots: { customRender: 'countsts' }
      },
      {
        dataIndex: 'countminnum',
        title: '最小金额（元）'
      },
      {
        dataIndex: 'countmaxnum',
        title: '最大金额（元）'
      },
      {
        dataIndex: 'counttime',
        title: '登记日期'
      },
      {
        dataIndex: 'countuptime',
        title: '更新日期'
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        scopedSlots: { customRender: 'action' },
        width: 120,
        align: 'center'
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
      queryCountInfo({
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current
      }).then(response => {
        this.pagination.total = Number(response.retData.total)
        response.retData.jpyCounts.forEach((el, index) => {
          this.dataList.push({
            key: index,
            ...el
          })
        })
      }).finally(() => {
        this.loading = false
      })
    },
    add () {
      this.visible = true
      this.flag = '1'
    },
    modify (record) {
      this.visible = true
      this.flag = '2'
      this.$nextTick(() => {
        this.form.setFieldsValue(this.$_.pick(record, Object.keys(this.form.getFieldsValue())))
      })
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (Number(values.countminnum) > Number(values.countmaxnum)) {
            this.$message.warning('最小金额应该不大于最大金额')
            return
          }
          this.$store.commit('frame/setSpinning', true)
          optCountInfo({
            ...values
          }).then(response => {
            this.$message.success('修改成功')
            this.query()
          }).finally(() => {
            this.$store.commit('frame/setSpinning', false)
          })
          this.visible = false
        }
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
