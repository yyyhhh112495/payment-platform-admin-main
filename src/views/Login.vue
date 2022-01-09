<template>
  <div class="login">
    <div class="container">
      <transition name="move-bottom">
        <div class="main" v-show="show">
          <div class="left">
            <div class="lottie1" ref="lottie2"></div>
          </div>
          <div class="right">
            <div class="top">
              <!-- http://www.diyiziti.com/guanggao 上首锐圆体 #d6a761 -->
              <img src="~@/assets/images/title.png">
            </div>
            <a-form-model ref="form" :model="form" :rules="rules">
              <a-form-model-item prop="username">
                <a-input placeholder="用户名" size="large" v-model.trim="form.username" autocomplete="off" @pressEnter="submitForm" allowClear @blur="getVerPic">
                  <a-icon slot="prefix" type="smile" theme="twoTone" twoToneColor="#999999" />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="password">
                <a-input-password placeholder="密码" size="large" v-model.trim="form.password" autocomplete="off" @pressEnter="submitForm" allowClear>
                  <a-icon slot="prefix" type="lock" theme="twoTone" twoToneColor="#999999" />
                </a-input-password>
              </a-form-model-item>
              <a-form-model-item prop="code" class="code">
                <a-input placeholder="验证码" size="large" v-model.trim="form.code" autocomplete="off" @pressEnter="submitForm" allowClear>
                  <a-icon slot="prefix" type="safety-certificate" theme="twoTone" twoToneColor="#999999" />
                </a-input>
                <img class="img" v-show="img" :src="img" @click="getVerPic">
                <a-button :loading="codeloading" class="btn" type="info" v-show="!img" @click="getVerPic">验证码</a-button>
              </a-form-model-item>
              <a-form-model-item>
                <a-checkbox :checked="form.checked" @change="onChange">记住账号</a-checkbox>
              </a-form-model-item>
              <a-form-model-item>
                <a-button block size="large" type="primary" @click="submitForm" :loading="loading">
                  {{loading ? '正在努力登录中....' : '登录'}}
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import lottie from 'lottie-web'
import { login, getVerPic } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: '',
        code: '',
        checked: true
      },
      loading: false,
      show: false,
      img: '',
      codeloading: false
    }
  },
  computed: {
    rules () {
      return {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    lottie.loadAnimation({
      container: this.$refs.lottie2, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('@/assets/json/two-businessmen.json') // the path to the animation json
    })
    this.show = true
    this.form.username = window.localStorage.getItem('username')
    this.form.checked = window.localStorage.getItem('remember') === '1'
  },
  methods: {
    onChange (e) {
      this.form.checked = e.target.checked
    },
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          login({ userphone: this.form.username.trim(), userpasswd: this.form.password, verfiycode: this.form.code }).then(response => {
            if (this.form.checked) {
              window.localStorage.setItem('username', this.form.username)
              window.localStorage.setItem('remember', '1')
            } else {
              window.localStorage.setItem('username', '')
              window.localStorage.setItem('remember', '0')
            }
            this.$store.commit('frame/setPanes', [])
            this.$store.commit('user/setUserInfo', {
              ...response.retData.user,
              menus: response.retData.menus
            })
            this.$store.commit('user/setToken', response.retData.token)
            this.$router.push({ path: '/' })
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    getVerPic () {
      this.$refs.form.validateField(['username'], valid => {
        if (!valid) {
          this.codeloading = true
          getVerPic({
            userphone: this.form.username.trim()
          }).then(response => {
            this.img = `data:image/png;base64,${response.retData.base64}`
          }).finally(() => {
            this.codeloading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  position: relative;
  .container{
    position: relative;
    width: 100%;
    min-height: 100%;
    background-image: url(../assets/images/bg.svg);
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .top{
      text-align: center;
      padding: 20px 0 40px 0;
      img{
        width: 100%;
      }
    }
    .main{
      min-width: 700px;
      height: 600px;
      padding: 30px;
      box-shadow: 0 20px 30px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(20px);
      transition: 0.5s ease;
      border-radius: 3px;
      display: flex;
      &:hover {
        box-shadow: 0 30px 40px rgba(0, 0, 0, 0.6);
      }
      .left{
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .right{
        width: 500px;
        padding: 0 20px;
        .img,.btn{
          width: 86px;
          height: 35px;
          margin: 0 0 5px 5px;
        }
        .code{
          /deep/ .ant-input-affix-wrapper {
            width: 80%;
          }
        }
      }
    }
  }
  .lottie1{
    width: 600px;
  }
  .lottie2{
    position: fixed;
    width: 40%;
    left: 0;
    bottom: 30px;
  }
  .move-bottom-enter-active {
    transition: all .8s;
  }
  .move-bottom-enter {
    opacity: 0;
    transform: translateY(-300px);
  }
}
</style>
