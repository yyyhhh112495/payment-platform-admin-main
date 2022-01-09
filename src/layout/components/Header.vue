<template>
  <a-layout-header class="contentbox-header">
    <div class="right">
      <div class="lottie1" ref="lottie1"></div>
      <a-dropdown placement="bottomRight" >
        <span class="text"> {{$store.state.user.userInfo.usrName}} <a-icon type="down" /> </span>
        <a-menu slot="overlay" @click="avatarMenuClick">
          <a-menu-item key="2">修改密码</a-menu-item>
          <a-menu-item key="1">退出登录</a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <a-modal
      title="修改密码"
      v-model="visible"
      destroyOnClose
    >
      <template slot="footer">
        <a-button type="primary" @click="handleOk">提交</a-button>
      </template>
      <a-form :form="form" class="form" style="padding:0 20px">
        <a-row :gutter="$global.drawerFormGrid.gutter">
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item required label="原始密码">
              <a-input-password
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'oldpasswd',
                  {
                    rules: [
                      { validator: validatePass3 }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item required label="新密码（最少8位）">
              <a-input-password
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'newpasswd',
                  {
                    rules: [
                      { validator: validatePass }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="$global.drawerFormGrid.sm">
            <a-form-item required label="重复新密码">
              <a-input-password
                placeholder="请输入"
                autocomplete="off"
                allowClear
                v-decorator="[
                  'newpasswd2',
                  {
                    rules: [
                      { validator: validatePass2 }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-layout-header>
</template>

<script>
import lottie from 'lottie-web'
import { logout, chgPasswd } from '@/api/user'
export default {
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this),
      validatePass2: (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else if (value !== this.form.getFieldValue('newpasswd')) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      },
      validatePass: (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else if (value.length < 8) {
          callback(new Error('长度应不小于8位'))
        } else {
          callback()
        }
      },
      validatePass3: (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else {
          callback()
        }
      }
    }
  },
  mounted () {
    lottie.loadAnimation({
      container: this.$refs.lottie1, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('@/assets/json/smile.json') // the path to the animation json
    })
  },
  methods: {
    avatarMenuClick (e) {
      if (e.key === '1') { // 退出登录
        this.exitLogin()
      } else if (e.key === '2') {
        this.visible = true
      }
    },
    exitLogin () {
      logout({
        userid: this.$store.state.user.userInfo.userid
      }).then(() => {
        this.$store.commit('frame/setPanes', [])
        this.$store.commit('user/setUserInfo', '')
        this.$store.commit('user/setToken', '')
        this.$router.replace({ path: '/login' })
      })
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$store.commit('frame/setSpinning', true)
          chgPasswd({
            ...values,
            userid: this.$store.state.user.userInfo.userid
          }).then(response => {
            this.$message.success('修改成功')
            this.visible = false
          }).finally(() => {
            this.$store.commit('frame/setSpinning', false)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.contentbox-header{
  height: 48px;
  padding: 0 16px;
  line-height: 48px;
}
.right{
  float: right;
  display: flex;
  color: #fff;
  padding-right: 20px;
}
.lottie1{
  width: 100px;
  margin-top: -17px;
  margin-right: -25px;
}
.text{
  cursor: pointer;
  &:hover{
    color: @theme-color;
  }
}
</style>
