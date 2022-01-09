<template>
  <div class="contentbox-tabs">
    <a-tabs
      hide-add
      type="editable-card"
      :tabBarStyle="{ paddingLeft: '16px' }"
      @edit="onEdit"
      :activeKey="tabsActiveKey"
      @change="changeTabs"
    >
      <div slot="tabBarExtraContent">
        <a-dropdown>
          <a-menu slot="overlay"  @click="handleMenuClick">
            <a-menu-item key="1">关闭其他</a-menu-item>
            <a-menu-item key="2">关闭所有</a-menu-item>
          </a-menu>
          <a-icon class="more" type="more" />
        </a-dropdown>
      </div>
      <a-tab-pane v-for="pane in panes" :key="pane.path" :closable="pane.path != '/dashboard'">
        <span slot="tab">
          {{pane.title}}
          <a-icon v-show="tabsActiveKey == pane.path" class="reload" :spin="reloadAnime" type="reload" @click="reloadPage(pane)"/>
        </span>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      panes: [],
      reloadAnime: false,
      keepRouterList: [],
      timer: ''
    }
  },
  computed: {
    tabsActiveKey () {
      return this.$route.fullPath
    }
  },
  watch: {
    $route (newValue, oldValue) {
      clearTimeout(this.timer)
      this.reloadAnime = false
      this.setTags(newValue)
    },
    panes () {
      const arr = []
      for (let i = 0, len = this.panes.length; i < len; i++) {
        arr.push(this.panes[i].name)
      }
      this.keepRouterList = arr
      this.$store.commit('frame/setPanes', this.panes)
    },
    keepRouterList () {
      this.$emit('setKeepRouter', this.keepRouterList)
    }
  },
  created () {
    if (!this.$_.isEmpty(this.$store.state.frame.panes)) {
      this.panes = this.$store.state.frame.panes
    } else {
      this.setTags(this.$route)
    }
  },
  methods: {
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    // 设置标签
    setTags (route) {
      const isExist = this.panes.some(item => {
        return item.path === route.fullPath
      })
      if (!isExist) {
        if (route.meta.noKeepAlive) {
          return
        }
        this.panes.push({
          title: route.meta.title,
          path: route.fullPath,
          name: route.matched[1].components.default.name
        })
      }
    },
    changeTabs (key) {
      this.$router.push({ path: key })
    },
    remove (targetKey) {
      let index = this.panes.findIndex(el => {
        return el.path === targetKey
      })
      const delItem = this.panes.splice(index, 1)[0]
      const item = this.panes[index] ? this.panes[index] : this.panes[index - 1]
      if (item) {
        delItem.path === this.$route.fullPath && this.$router.push(item.path)
      } else {
        this.$router.push('/')
      }
    },
    reloadPage (pane) {
      this.reloadAnime = true
      this.timer = setTimeout(() => {
        this.reloadAnime = false
      }, 1000)
      let index = this.keepRouterList.findIndex(el => {
        return el === pane.name
      })
      this.keepRouterList.splice(index, 1)
      this.$emit('setReload')
      this.$nextTick(() => {
        this.keepRouterList.push(pane.name)
        this.$emit('setReload')
      })
    },
    handleMenuClick (e) {
      if (e.key === '1') { // 关闭其他
        const curItem = this.panes.filter(item => {
          return item.path === this.$route.fullPath || item.path === '/dashboard'
        })
        this.panes = curItem
      } else { // 关闭所有
        this.panes.splice(1, this.panes.length - 1)
        this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.contentbox-tabs{
  width: 100%;
  height: 62px;
  padding-top: 6px;
  background-color: #fff;
  box-shadow: 0 1px 4px #00152914;
  position: relative;
  z-index: 5;
  .more{
    font-size: 16px;
    cursor: pointer;
    margin-right: 8px;
    padding: 12px;
  }
  .more:hover {
    color: @theme-color;
  }
  .reload{
    cursor: pointer;
    margin: 0 5px 0 16px;
    transition: all 0.3s;
    color: #838383;
  }
  .reload:hover {
    color: @theme-color;
  }
  /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    border-radius: 2px 2px 0 0;
  }
}
</style>
