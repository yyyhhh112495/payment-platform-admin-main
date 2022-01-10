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
              <a-form-item label="商户登录名">
                <a-input v-model="queryParam.bussphone" allowClear autocomplete="off" placeholder="请输入"/>
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
          <a-divider type="vertical" />
          <a @click="view(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="reset(record)">重置密码</a>
          <a-divider type="vertical" />
          <a @click="del(record)">一键清除</a>
        </span>
        <span slot="bussstatus" slot-scope="record">
          <a-tag
            :color="record == '1' ? 'green' : record == '0' ? 'red' : ''">
            {{$global.syscode.STATUS[record]}}
          </a-tag>
        </span>
      </a-table>
    </div>
    <a-modal
      :title="flag == '1' ? '新增' : flag == '1' ? '修改' : '查看'"
      v-model="visible"
      destroyOnClose
    >
      <template slot="footer">
        <a-button type="primary" @click="handleOk">提交</a-button>
      </template>
      <a-form :form="form" class="form" style="padding:0 20px">
        <a-row :gutter="$global.drawerFormGrid.gutter">
          <a-col :sm="$global.drawerFormGrid.sm" v-if="flag != '1'">
            <a-form-item label="商户ID">
              <a-input
                disabled
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'bussinessid',
                  {
                    rules: [
                      { required: true, message: '请输入商户ID'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="商户名称">
              <a-input
                :disabled="flag == '3'"
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'bussinessname',
                  {
                    rules: [
                      { required: true, message: '请输入商户名称'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="商户登录名">
              <a-input
                :disabled="flag == '3'"
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'bussphone',
                  {
                    rules: [
                      { required: true, message: '请输入商户登录名'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="商户费率（%）">
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
                  'bussratio',
                  {
                    rules: [
                      { required: true, message: '请输入商户费率'}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item label="商户状态">
              <a-select
                :disabled="flag == '3'"
                allowClear
                placeholder="请选择"
                v-decorator="[
                  'bussstatus',
                  {
                    rules: [
                      { required: true, message: '请选择商户状态'}
                    ]
                  }
                ]">
                <a-select-option v-for="(label, value) in $global.syscode.STATUS" :key="value" :value="value">{{label}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { queryOrgInfo, optOrgInfo, delRecords } from '@/api/common'
import { restPasswd } from '@/api/user'
export default {
  name: 'ShopManager',
  data () {
    return {
      advanced: false,
      queryParam: {},
      columns: [],
      dataList: [],
      loading: false,
      pagination: this.$global.pagination(),
      flag: '',
      visible: false,
      form: this.$form.createForm(this)
    }
  },
  created () {
    this.columns = [
      {
        dataIndex: 'bussinessid',
        title: '商户ID'
      },
      {
        dataIndex: 'bussinessname',
        title: '商户名称'
      },
      {
        dataIndex: 'bussphone',
        title: '商户登录名'
      },
      {
        dataIndex: 'bussratio',
        title: '商户费率（%）'
      },
      {
        dataIndex: 'bussstatus',
        title: '状态',
        scopedSlots: { customRender: 'bussstatus' }
      },
      {
        dataIndex: 'addtime',
        title: '登记日期'
      },
      {
        dataIndex: 'uptime',
        title: '更新日期'
      },
      {
        dataIndex: 'prikey',
        title: '秘钥'
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        scopedSlots: { customRender: 'action' },
        width: 180,
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
      queryOrgInfo({
        pageSize: this.pagination.pageSize,
        pageNum: this.pagination.current,
        ...this.queryParam
      }).then(response => {
        this.pagination.total = Number(response.retData.total)
        response.retData.bussinesses.forEach((el, index) => {
          this.dataList.push({
            key: index,
            ...el
          })
        })
      }).finally(() => {
        this.loading = false
      })
    },
    modify (record) {
      this.visible = true
      this.flag = '2'
      this.$nextTick(() => {
        this.form.setFieldsValue(this.$_.pick(record, Object.keys(this.form.getFieldsValue())))
      })
    },
    view (record) {
      this.visible = true
      this.flag = '3'
      this.$nextTick(() => {
        this.form.setFieldsValue(this.$_.pick(record, Object.keys(this.form.getFieldsValue())))
      })
    },
    del (record) {
      this.$confirm({
        title: '是否清除',
        onOk: () => {
          delRecords({
            ...record,
            bussinessid: record.bussinessid
          }).then(response => {
            this.$message.success('清除成功')
            this.query()
          }).finally(() => {
            this.$store.commit('frame/setSpinning', false)
          })
        }
      })
    },
    add () {
      this.visible = true
      this.flag = '1'
      this.$nextTick(() => {
        this.form.setFieldsValue({
          bussstatus: '1'
        })
      })
    },
    reset (item) {
      this.$confirm({
        title: '是否重置密码',
        onOk: () => {
          this.$store.commit('frame/setSpinning', true)
          restPasswd({
            ...item,
            userid: this.$store.state.user.userInfo.userid
          }).then(response => {
            this.$message.success('重置成功')
            this.query()
          }).finally(() => {
            this.$store.commit('frame/setSpinning', false)
          })
        }
      })
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.flag === '1') {
            this.$store.commit('frame/setSpinning', true)
            optOrgInfo({
              ...values
            }).then(response => {
              this.$message.success('新增成功')
              this.query()
            }).finally(() => {
              this.$store.commit('frame/setSpinning', false)
            })
          } else if (this.flag === '2') {
            this.$store.commit('frame/setSpinning', true)
            optOrgInfo({
              ...values
            }).then(response => {
              this.$message.success('修改成功')
              this.query()
            }).finally(() => {
              this.$store.commit('frame/setSpinning', false)
            })
          }
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
