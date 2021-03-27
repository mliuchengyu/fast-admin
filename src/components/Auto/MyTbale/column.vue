<template>
  <el-dropdown trigger="click" :hide-on-click="false" @visible-change="dropChange">
    <span class="el-dropdown-link">
      控制要展示的字段<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(item, index) in newTable" :key="index" :command="index">
        <el-checkbox :checked="item.checked===false?false:true" :label="item.attr.label" @change="handleCommand(index)"> {{ item.attr.label }} </el-checkbox>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'MyTableColumn',
  model: {
    prop: 'value',
    event: 'return-columnData'
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      newTable: [],
    };
  },
  created() {
    this.newTable = JSON.parse(JSON.stringify(this.value.filter(item => {
      return item.attr.prop;
    })));
  },
  methods: {
    dropChange(bool) {
      if (bool === false) {
        for (const i in this.value) {
          for (const j in this.newTable) {
            if (this.value[i].attr.label === this.newTable[j].attr.label) {
              this.$set(this.value[i], 'checked', this.newTable[j].checked);
            }
          }
        }
        this.$emit('return-columnData', this.value);
      }
    },
    handleCommand(i) {
      this.newTable[i].checked = !this.newTable[i].checked;
    }
  },
};
</script>

<style scoped lang="scss">
  .cloumn_set{
    width: 120px;
    max-height: 200px;
    overflow: auto;
  }
  .el-checkbox{
    width: 25%;
  }

.el-popper{
    margin-top: 0px;
    max-height: 200px;
    overflow: auto;
    min-width: 130px;
}
.el-dropdown-link{
  cursor: pointer;
  color: #409eff !important;
  .el-icon--right{
    font-size: 10px;
  }
}
.el-dropdown-menu--mini {
  ::v-deep.el-checkbox__label{
    line-height: 34px;
  }
}
</style>
