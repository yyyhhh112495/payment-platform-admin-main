<template>
  <div class="page box">
    <a-result status="404" title="404" subTitle="啊哦~ 你所访问的页面不存在哦">
      <template v-slot:extra>
        <router-link to="/">
          <a-button type="primary">返回首页</a-button>
        </router-link>
        <a-button type="primary" @click="goBack">返回上一页</a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
export default {
  name: 'M404',
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
</style>
