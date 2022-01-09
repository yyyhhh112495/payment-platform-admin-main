<template>
  <div class="page box">
    <a-result status="403" title="403" subTitle="啊哦~ 你没有权限访问该页面哦">
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
  name: 'M403',
  methods: {
    goBack () {
      this.$router.go(-2)
    }
  }
}
</script>

<style scoped>
</style>
