<template>
  <div class="my_tables">
    <!-- 表格功能按钮 -->
    <slot name="slotBtns"></slot>
    <!-- 表格 -->
    <div class="my_table">
      <MyTableColumn v-if="columnShow" v-model="newTable" />
      <!-- table -->
      <el-table
        v-bind="$attrs"
        :data="tableData"
        :border="true"
        :default-sort="{prop:'date',order:'descending'}"
        v-on="$listeners"
      >
        <template v-for="item in newCloumn">
          <el-table-column v-if="!item.slot" :key="item.attr.prop || item.type" v-bind="item.attr || {}" :formatter="item.render" show-overflow-tooltip />
        </template>
      </el-table>
      <!-- 表格合计 -->
      <div v-if="tableTotal.length>0 && tableData.length" class="totla">
        <span>合计：</span>
        <ul>
          <li v-for="item in tableTotal" :key="item.label">{{ item.label }}：{{ item.value }}</li>
        </ul>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'MyTablesData',
  props: {
    tableData: { // 初始表格数据
      type: Array,
      default: () => [],
    },
    tableBtns: { // 是否展示btn
      type: Boolean,
      default: true
    },
    columnShow: { // 是否展示表头列表设置
      type: Boolean,
      default: false
    },
    columnData: { // 表头数据
      type: Array,
      default: () => [{ prop: '', label: '' }],
    },
    tableTotal: { // 表格合计数据
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      newTable: [],
    };
  },
  computed: {
    newCloumn: {
      get() {
        const data = this.newTable.filter(item => {
          return item.checked !== false;
        });
        return data;
      },
      set(n) {
        return n;
      }

    },
  },
  created() {
    this.newTable = this.columnData.map((item, i) => {
      if (item.checked !== false) {
        this.$set(this.columnData[i], 'checked', true);
      }
      return item;
    });
  },
};
</script>
<style lang="scss" scoped>
  .pagintion{
    text-align: center;
    line-height: 36px;
    margin-top:10px;
    .el-pagination{
      display: inline-block;
      margin: 3px 10px;
      padding: 0;
      line-height: 28px;
      ::v-deep.el-select{
        width: 100px;
      }
      ::v-deep.el-select-dropdown {
        min-width: 100px;
      }
    }
    .el-button{
      padding: 7px 10px;
    }
  }
  .el-form-item {
    ::v-deep.el-form-item__label {
      font-weight: normal;
    }
    ::v-deep.el-input{
      input{
        padding: 0 15px;
      }
    }
    ::v-deep.el-textarea{
      textarea{
        padding: 5px 9px 5px 15px;
      }
    }
  }
  .my_tables{
    .totla{
      font-size: 12px;
      color: #606266;
      border: 1px solid #dfe6ec;
      border-top: none;
      line-height: 24px;
      padding: 0 10px;
      ul{
        padding: 0;
        margin: 0;
        display: inline-block;
        li{
          list-style: none;
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
  }
</style>
