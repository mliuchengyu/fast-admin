<template>
  <el-cascader v-model="selectedOptions" clearable :options="options" :separator="'/'" placeholder="请选择省市区" @change="handleChange" />
</template>

<script>
import options from '@/utils/country-level3.js';

export default {
  name: 'Address',
  props: {
    city: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      options: options, // 存放城市数据也就是显示出来
    };
  },
  computed: {
    selectedOptions: {
      get() {
        return this.city;
      },
      set(newval) {
        return newval;
      },
    },
  },
  methods: {
    handleChange(type) {
      // select回调，判断当前下拉框是否展示
      this.changeFlag = type;
      this.$emit('city', type);
    },
  },
};
</script>

<style scoped lang="scss">
</style>
