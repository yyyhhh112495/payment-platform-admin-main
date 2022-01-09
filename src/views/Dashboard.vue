<template>
  <div class="page">
    <div class="box">
      <div class="lottie1" ref="lottie1"></div>
      <div class="lottie1" ref="lottie2"></div>
    </div>
  </div>
</template>

<script>
import lottie from 'lottie-web'
export default {
  name: 'Dashboard',
  data () {
    return {
    }
  },
  mounted () {
    lottie.loadAnimation({
      container: this.$refs.lottie1, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('@/assets/json/jump.json') // the path to the animation json
    })
    lottie.loadAnimation({
      container: this.$refs.lottie2, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('@/assets/json/jump.json') // the path to the animation json
    })
  }
}
</script>

<style lang="less" scoped>
.box{
  display: flex;
}
.lottie1{
  width: 300px;
  &:last-child{
    transform: rotateY(180deg)
  }
}
</style>
