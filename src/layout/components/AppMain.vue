<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :max="20">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import Bus from '@/utils/bus';
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.fullPath;
    }
  },
  mounted() {
    // 关闭标签触发
    Bus.$on('removeCache', (name, view) => {
      this.removeCache(name, view);
    });
  },
  methods: {
    // 获取有keep-alive子节点的Vnode
    getVnode() {
      // 判断子集非空
      if (this.$children.length === 0) return false;
      let vnode;
      for (const item of this.$children) {
        // 如果data中有key则代表找到了keep-alive下面的子集，这个key就是router-view上的key
        if (item.$vnode.data.key) {
          vnode = item.$vnode;
          break;
        }
      }
      return vnode || false;
    },
    // 移除keep-alive缓存
    removeCache(name, view = {}) {
      const vnode = this.getVnode();
      if (!vnode) return false;
      const componentInstance = vnode.parent.componentInstance;
      // 这个key是用来获取前缀用来后面正则匹配用的
      const keyStart = vnode.key.split('/')[0];
      const thisKey = `${keyStart}${view.fullPath}`;
      const regKey = `${keyStart}${view.path}`;

      this[name]({ componentInstance, thisKey, regKey });
    },
    // 移除其他
    closeOthersTags({ componentInstance, thisKey }) {
      Object.keys(componentInstance.cache).forEach((key, index) => {
        if (key !== thisKey) {
          // 1 销毁实例(这里存在多个key指向一个缓存的情况可能前面一个已经清除掉了所有要加判断)
          if (componentInstance.cache[key]) {
            componentInstance.cache[key].componentInstance.$destroy();
          }
          // 2 删除缓存
          delete componentInstance.cache[key];
          // 3 移除key中对应的key
          componentInstance.keys.splice(index, 1);
        }
      });
    },
    // 移除所有缓存
    closeAllTags({ componentInstance }) {
      // 1 销毁实例
      Object.keys(componentInstance.cache).forEach(key => {
        if (componentInstance.cache[key]) {
          componentInstance.cache[key].componentInstance.$destroy();
        }
      });
      // 2 删除缓存
      componentInstance.cache = {};
      // 3 移除key中对应的key
      componentInstance.keys = [];
    },
    // 移除单个缓存
    closeSelectedTag({ componentInstance, regKey }) {
      const reg = new RegExp(`^${regKey}`);
      Object.keys(componentInstance.cache).forEach((key, i) => {
        if (reg.test(key)) {
          // 1 销毁实例
          if (componentInstance.cache[key]) {
            componentInstance.cache[key].componentInstance.$destroy();
          }
          // 2 删除缓存
          delete componentInstance.cache[key];
          // 3 移除key中对应的key
          componentInstance.keys.splice(i, 1);
        }
      });
    }
  },
  beforeDestory() {
    Bus.$off('removeCache');
  },
};
</script>
