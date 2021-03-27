<template>
  <div class="my_select">
    <el-cascader
      v-if="name==='roles_users'"
      ref="myCascader"
      v-model="IdVal"
      :options="options"
      filterable
      clearable
      :props="{ expandTrigger: 'hover' }"
      @change="handleChangeSelect"
    />

  </div>
</template>

<script>
export default {
  name: 'MySelectUsers',
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
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      options: [],
    };
  },
  computed: {
    IdVal: {
      get() {
        return this.value;
      },
      set(newVal) {
        return newVal;
      },
    },
  },
  async created() {
    this.url = this.name;
    const res = await this.request({ url: this.url, method: 'get' });
    this.options = res.data;
    if (this.options) {
      this.options = this.options.map(item => {
        item.label = item.name;
        item.value = item.id;
        if (item.children) {
          item.children.map(items => {
            items.label = items.name;
            items.value = items.id;
          });
        }
        return item;
      });
    }
    console.log(res.data);
    console.log(this.options);
  },
  methods: {
    handleChangeSelect(val) {
      console.log(val);
      if (val.length > 0) {
        this.$refs.myCascader.getCheckedNodes()[0].pathLabels;
      }
      this.$emit('returnSelectId', val[1] || null);
    }
  },
};
</script>

<style scoped lang="scss">
.my_select {
  display: inline-block;
}
</style>
