<template functional>
  <a-sub-menu>
    <span slot="title">
      <a-icon v-if="props.menuInfo.ruleIcon" :type="props.menuInfo.ruleIcon" />
      <span>{{ props.menuInfo.ruleDesc }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="item.children.length == 0" :key="item.ruleUrl">
        <router-link :to="{ path: item.ruleUrl }">
          <a-icon v-if="item.ruleIcon" :type="item.ruleIcon"/>
          <span>{{item.ruleDesc}}</span>
        </router-link>
      </a-menu-item>
      <sub-menu v-else :key="item.ruleUrl" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ['menuInfo']
}
</script>
