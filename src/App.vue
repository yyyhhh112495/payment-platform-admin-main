<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
      <transition name="fade-mask" mode="out-in">
        <div class="mask" v-show="spinning">
          <div class="lottie" ref="lottieitem"></div>
        </div>
      </transition>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import lottie from 'lottie-web'
export default {
  name: 'App',
  data () {
    return {
      locale: zhCN
    }
  },
  computed: {
    spinning () {
      return this.$store.state.frame.spinning
    }
  },
  mounted () {
    lottie.loadAnimation({
      container: this.$refs.lottieitem, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('@/assets/json/loading.json') // the path to the animation json
    })
  }
}
</script>

<style lang="less">
.move-leave-active,
.move-enter-active {
  transition: all .3s;
}
.move-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.move-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.fade-mask-leave-active,
.fade-mask-enter-active {
  transition: all .3s;
}
.fade-mask-enter {
  opacity: 0;
}
.fade-mask-leave-to {
  opacity: 0;
}
.mask{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  .lottie{
    width: 200px;
    padding-bottom: 200px;
  }
}
</style>
