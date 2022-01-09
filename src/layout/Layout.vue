<template>
  <a-layout class="qucik-layout">
    <q-header></q-header>
    <a-layout>
      <q-menu></q-menu>
      <a-layout>
        <q-tabs @setReload="isReload = !isReload" @setKeepRouter="val => keepRouterList = val"></q-tabs>
        <a-layout-content class="layout-content">
          <transition name="move" mode="out-in">
            <keep-alive :include="keepRouterList">
              <router-view :key="$route.path" v-if="isReload"></router-view>
            </keep-alive>
          </transition>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import QMenu from './components/Menu.vue'
import QHeader from './components/Header.vue'
import QTabs from './components/Tabs.vue'
export default {
  name: 'Layout',
  data () {
    return {
      keepRouterList: [],
      isReload: true
    }
  },
  components: {
    QHeader,
    QMenu,
    QTabs
  }
}
</script>

<style lang="less" scoped>
.qucik-layout{
  width: 100%;
  height: 100%;
}
.layout-content{
  overflow-y: auto;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
</style>
