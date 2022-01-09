<template>
  <a-layout-sider
    class="contentbox-sider"
    theme="light"
    :trigger="null"
    v-model="collapsed"
    breakpoint="lg"
    :collapsedWidth="collapsedWidth"
  >
    <div class="sider-menu">
      <a-menu mode="inline" :selectedKeys="[menuKey]">
        <template v-for="item in menusList">
          <a-menu-item v-if="item.children.length == 0" :key="item.ruleUrl">
            <router-link :to="{ path: item.ruleUrl }">
              <a-icon v-if="item.ruleIcon" :type="item.ruleIcon"/>
              <span>{{item.ruleDesc}}</span>
            </router-link>
          </a-menu-item>
          <sub-menu v-else :key="item.ruleUrl" :menuInfo="item" />
        </template>
      </a-menu>
    </div>
    <div class="sider-trigger">
      <a-icon
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="toggleCollapsed()"
      />
    </div>
  </a-layout-sider>
</template>

<script>
import SubMenu from './SubMenu.vue'
export default {
  data () {
    return {
      collapsed: false,
      collapsedWidth: '48',
      menusList: []
    }
  },
  components: {
    SubMenu
  },
  computed: {
    menuKey () {
      return this.$route.path.replace('/', '')
    }
  },
  created () {
    // ruleCde-菜单码 ruleDesc-标题 ruleIcon-图标 path-ruleUrl
    this.menusList = [
      {
        ruleIcon: 'history',
        ruleUrl: 'dashboard',
        ruleDesc: '工作台',
        children: []
      }, ...this.$store.state.user.userInfo.menus
    ]
  },
  methods: {
    toggleCollapsed () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<style lang="less" scoped>
.contentbox-sider{
  box-shadow: 2px 0 8px 0 #1d23290d;
  position: relative;
  z-index: 10;
}
.sider-trigger{
  width: 100%;
  height: 40px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  .trigger {
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;
    padding-left: 16px;
  }
  .trigger:hover {
    color: @theme-color;
  }
}
.sider-menu{
  flex: 1 1 0%;
  overflow: hidden auto;
  /deep/ .ant-menu-inline-collapsed {
    width: @sider-width;
  }
  /deep/ .ant-menu-inline-collapsed > .ant-menu-item{
    width: @sider-width;
    padding: 0 @sider-padding !important;
  }
  /deep/ .ant-menu-light {
    border-right-color: transparent;
  }
  /deep/ .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
    padding: 0 @sider-padding !important;
  }
}
.contentbox-sider /deep/ .ant-layout-sider-children {
  display: flex;
  flex-direction: column;
}
</style>
