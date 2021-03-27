<template>
  <div class="my_select">
    <el-select
      v-model="IdVal"
      v-el-select-loadmore="loadmore"
      :filter-method="filterMethodThrottle"
      v-bind="$attrs"
      :multiple="multiple"
      :collapse-tags="collapseTags"
      :clearable="clearable"
      :filterable="filterable"
      :placeholder="placeholder"
      :disabled="disabled"
      @change="handleChange"
      @focus="focusFun"
      @visible-change="refresh"
    >
      <el-option v-for="item in newData" v-show="!filterVal || initOption.includes(item.value)" :key="item.id" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script>

import Vue from 'vue';
Vue.directive(
  'el-select-loadmore', {
    bind(el, binding) {
      // 因为el-select最终会渲染成ul  li  ，所以我们要找到对应的ul元素节点，因为最底层的滚动条就是这个ul的
      const SELECTDOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
      // 为对应的ul绑定滚动条滚动事件
      SELECTDOM.addEventListener('scroll', function() {
        const condition = this.scrollHeight - this.scrollTop === this.clientHeight;
        // 判断滚动到底部
        if (condition) {
          // binding.value 为自定义指令绑定的值，因为绑定的是个方法，所以这里是方法调用，触发指令后执行加载数据
          binding.value();
        }
      });
    }
  }
);

export default {
  name: 'MySelect',
  model: {
    prop: 'value',
    event: 'returnSelectId',
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    value: {
      type: [Number, Array, String],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: true
    },
    collapseTags: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '',
    },
    param: {
      type: [Number, Array, String],
      default: '',
    },
    init: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      url: '',
      initOption: [], // 满足筛选条件的val集合
      filterVal: '', // 搜索条件
      filterArray: [], // 所有可展示的数据 (符合搜索条件 && newData没有的数据)
      newData: [], // 正在展示的数据或展示过的数据
      page: 1,
      per_page: 9999,
    };
  },
  computed: {
    IdVal: {
      get() {
        let id = null;
        if (this.value !== 0) id = this.value;
        return id;
      },
      set(n) {
        let id = null;
        if (n !== 0) id = n;
        return id;
      },
    },
    // 防抖
    filterMethodThrottle() {
      var time = null;
      return (param) => {
        if (time) {
          clearTimeout(time);
        }
        time = setTimeout(() => {
          // 搜索方法
          this.filterMethod(param);
          clearTimeout(time);
        }, 200);
      };
    }
  },
  watch: {
    value: {
      handler(n) {
        this.IdVal = n;
        this.initData();
      },
    }
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化搜索数据
    focusFun() {
      this.filterArray = [...this.options];
      this.initOption = [];
      this.filterVal = '';
      this.newData = [];
      this.loadmore();
    },
    // 滚动加载
    loadmore() {
      const oldArray = this.filterArray; // 可展示预备数据
      const newArray = this.newData; // 展示的数据
      let pushArray = []; // 新增的数据

      // 当加载完毕时 直接退出方法
      if (newArray.length === oldArray.length) return;

      // 当剩余要加载的不足15个时  则加载全部的
      if (newArray.length + 15 > oldArray.length) {
        pushArray = oldArray.slice(0);
        this.filterArray.splice(0);
      } else {
        pushArray = oldArray.slice(0, 15);
        this.filterArray.splice(0, 15);
      }
      // 搜索后展示的数据
      this.newData = [...newArray, ...pushArray];
    },
    filterMethod(params) {
      // 记录下搜索条件
      this.filterVal = params;
      // 搜索方法
      const vals = [];
      const filterArray = [];
      this.options.forEach((item, i) => {
        // 有搜索条件时  查找符合条件的
        if (params && item.label.includes(params)) {
          // 添加所有符合搜索条件的val值
          vals.push(item.value);
          // 寻找符合搜索条件且newData中没有出现过的数据
          if (!this.newData.find(fin => fin.value === item.value)) {
            filterArray.push(item);
          }
        } else if (!params) { // 无搜索条件时  获取所有剩余newData中没有出现过的数据
          if (!this.newData.find(fin => fin.value === item.value)) {
            filterArray.push(item);
          }
        }
      });

      this.initOption = [...vals];
      this.filterArray = [...filterArray];
      this.loadmore();
    },
    async initData() {
      // this.url = this.name.replace(/_/g, '');
      this.url = this.name;
      // if (this.param) {
      //   this.url = this.url + '/' + this.param;
      // }
      const params = {
        page: this.page,
        per_page: this.per_page,
      };
      if (this.name === 'batch_list') params.batch_list_distinguish = this.param;
      if (this.name === 'channel') params.channel_status = 1;
      if (this.name === 'agent') params.agent_status = 1;
      if (this.name === 'customer') params.customer_status = 1;
      if (this.name === 'recipient') params.recipient_status = 1;
      const res = await this.request({ url: this.url, method: 'get', params });
      this.options = res.data.map(item => {
        return {
          label: item[this.name + '_ch_query'] || item[this.name + '_chinese'] || item[this.name + '_name'] || item[this.name + '_code'] || item.name,
          value: item[this.name + '_id'] || item.id
        };
      });
      let index = null;
      if (this.IdVal) { // 判断有id  数据放最前面，方便回显数据
        this.options.map((item, i) => {
          if (this.IdVal === item.value) {
            index = i;
          }
        });
        if (index) {
          const obj = this.options[index];
          this.options.splice(index, 1);
          this.options.unshift(obj);
        }
      }
      this.initOption = [];
      this.filterVal = '';
      this.newData = [];
      this.filterArray = [];
      this.filterArray = [...this.options];
      // 初始时加载一次
      this.loadmore();
    },
    handleChange(val) {
      let obj = {};
      if (val instanceof Array) {
        // const i = val.find(items => {
        //   if (item.value === items) return item.value;
        // });
        // return item.value === i;
        const objArr = val.map(items => {
          const arr = this.options.filter(item => {
            return items === item.value;
          });
          return arr[0];
        });
        obj.label = objArr.map(item => {
          return item.label;
        }).join(',');
        obj.id = objArr.map(item => {
          return item.value;
        }).join(',');
      } else {
        obj = this.options.find((item) => {
          return item.value === val;
        });
      }

      if (obj !== undefined) {
        this.$emit('returnLabel', obj.label);
      }
      this.$emit('returnSelectId', val || null);
    },
    async refresh(bool) { // 重新加载数据
      if (bool && this.init) {
        this.initData();
      }
    }
  },
};
</script>

<style scoped lang="scss">
.my_select {
  display: inline-block;
}
</style>
