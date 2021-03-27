<template>
  <div class="my_table">

    <MyTableColumn v-if="columnShow" v-model="newTable" />
    <!-- table -->
    <el-table
      v-loading="$store.state.table.loadingBool"
      v-bind="$attrs"
      :border="true"
      v-on="$listeners"
    >
      <template v-for="(item, index) in newCloumn">
        <!-- 需要对数据进行特殊操作的 -->
        <el-table-column v-if="item.slot" :key="index" v-bind="item.attr" show-overflow-tooltip>
          <template slot-scope="scope">
            <slot :name="item.slot" :scope="scope"></slot>
          </template>
        </el-table-column>
        <!-- 正常数据显示展示 -->
        <el-table-column v-else :key="index" show-overflow-tooltip v-bind="item.attr || {}" :sort-method=" (a, b) => { return a.lawsuit - b.lawsuit; } " />
      </template>
    </el-table>
    <div v-if="totalShow" class="table_total">
      <span>合计：</span>
      <span>总票数：</span>
      <span>总票数：</span>
      <span>总票数：</span>
      <span>总票数：</span>
      <span>总票数：</span>
      <span>总票数：</span>
    </div>
    <el-pagination
      v-if="pagination"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="paginationObj.current_page"
      :page-sizes="pageSizes"
      :page-size="paginationObj.per_page"
      :total="paginationObj.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  name: 'MyTable',
  props: {
    // 表头列表设置
    columnShow: {
      type: Boolean,
      default: false
    },
    totalShow: { // 表格合计模块
      type: Boolean,
      default: false,
    },
    // 表格分页模块
    pagination: {
      type: Boolean,
      default: true,
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => [],
      required: false,
    },
    // 表头数据
    columnData: {
      type: Array,
      default: () => [{ prop: '', label: '' }],
    },
    // 分页数据量
    pageSizes: {
      type: Array,
      default: () => [15, 30, 50],
    },
    paginationObj: {
      type: Object,
      default: () => {
        return {
          total: 0,
          page: 1,
          per_page: 0,
          total_pages: 1,
        };
      },
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
  methods: {
    // 选择页码=>当前页
    handleCurrentChange(currentPage) {
      this.$emit('handleChange', this.paginationObj.page, currentPage);
      const searchFrom = this.$store.state.table.searchFrom;
      searchFrom.page = currentPage;
      // this.$store.commit('table/SET_PAGE', currentPage);
      this.$store.dispatch(
        'table/setSearchFrom',
        JSON.parse(JSON.stringify(searchFrom))
      );
    },
    // 页码展示条数
    handleSizeChange(pageSize) {
      this.$emit('handleChange', this.paginationObj.per_page, pageSize);
      this.$emit('handleChange', this.paginationObj.page, 1);
      const searchFrom = this.$store.state.table.searchFrom;
      searchFrom.per_page = pageSize;
      searchFrom.page = 1;
      this.$store.dispatch(
        'table/setSearchFrom',
        JSON.parse(JSON.stringify(searchFrom))
      );
    },
  },
};
</script>
<style lang="scss">
/* .el-table {
  min-height: 300px;
} */
.my_table{
  .cell {
    white-space: pre-line ;
  }
}
.el-table{
  .el-table__header th{
    background: #f8f8f9;
    color: #515a6e;
    line-height: 34px;
    padding: 0;
  }
  .el-table__body td {
    padding: 3px 0;
    height: 23px;
  }
  th .el-checkbox{
  margin: 0 0 0 -4px;
  }
}
.el-pagination {
  margin-top: 10px;
  text-align: center;
}
.my_table {
  padding-top: 15px;
}
.table_total{
  font-size: 14px;
}
</style>
