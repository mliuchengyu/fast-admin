<template>
  <div class="my_tables">
    <!-- 搜索 -->
    <el-form v-if="searchShow" :inline="true" :label-width="labelWidth" label-position="right">
      <template v-for="item in searchData">
        <el-form-item v-if="item.prop" :key="item.prop" :label="item.label" :style="{width:item.width||formItemWidth}">
          <!-- 输入框 -->
          <el-input
            v-if="item.type==='input'"
            v-model="searchForm[item.prop]"
            v-bind="item"
            clearable
          />
          <!-- 输入框 只能数字和字母-->
          <el-input
            v-if="item.type==='inputNY'"
            v-model="searchForm[item.prop]"
            v-bind="item"
            clearable
            @input="inputNY($event,item.prop)"
          />
          <!-- 输入框 整数number-->
          <el-input
            v-if="item.type==='inputI'"
            v-model.number="searchForm[item.prop]"
            v-bind="item"
            clearable
            @input="inputI($event,item.prop)"
          />
          <!-- 输入框 小数number-->
          <el-input
            v-if="item.type==='inputF'"
            v-model.trim="searchForm[item.prop]"
            v-bind="item"
            clearable
            @input="inputF($event,item.prop,item.num)"
          />

          <!-- 文本域 -->
          <el-input
            v-if="item.type==='textarea'"
            v-model="searchForm[item.prop]"
            v-bind="item"
            clearable
            type="textarea"
          />
          <!-- 下拉框 -->
          <el-select
            v-if="item.type==='select'"
            v-model="searchForm[item.prop]"
            v-bind="item"
            clearable
          >
            <el-option v-for="op in item.options" :key="op.value" :label="op.label" :value="op.value" />
          </el-select>
          <!-- 单选 -->
          <el-radio-group
            v-if="item.type==='radio'"
            v-model="searchForm[item.prop]"
            v-bind="item"
            clearable
          >
            <el-radio v-for="ra in item.options" :key="ra.value" :label="ra.value">{{ ra.label }}</el-radio>
          </el-radio-group>
          <!-- 日期时间 -->
          <el-date-picker
            v-if="item.type==='datetime'"
            v-model="searchForm[item.prop]"
            v-bind="item"
            type="datetime"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          <!-- 日期时间 双-->
          <el-date-picker
            v-if="item.type==='datetimerange'"
            v-model="datetimerange"
            v-bind="item"
            clearable
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="(val)=>{timeChange(val,item.prop)}"
          />
          <!-- 输入框 双 -->
          <div v-if="item.type==='inputDobule'" class="weight">
            <el-input v-model="weight1" placeholder="起重量" @change="(val)=>{inputDobule(val,item.prop)}" />
            —
            <el-input v-model="weight2" placeholder="止重量" @change="(val)=>{inputDobule(val,item.prop)}" />
          </div>
          <!-- 自定义下拉选择 -->
          <MySelect
            v-if="item.type==='MySelect'"
            v-model="searchForm[item.prop]"
            :name="item.name"
            :param="item.param"
            :multiple="item.multiple"
            :collapse-tags="item.collapseTags"
            :clearable="item.clearable"
            :filterable="item.filterable"
            @returnLabel="returnLabel"
          />
          <slot v-if="item.type==='solt'" :name="item.name"> </slot>

        </el-form-item>
        <!-- 自定义搜索客户姓名 -->
        <slot v-if="item.type==='cusmoter'" name="cusmoter"> </slot>
        <!-- 默认插槽 -->
      </template>
      <slot> </slot>
      <el-form-item>
        <el-button type="primary" :loading="loadingBtn" @click="searchTable">
          {{ !loadingBtn?'查 询':'查询中' }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="resetShow" @click="reset">重 置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格功能按钮 -->
    <slot name="slotBtns"></slot>
    <!-- 表格 -->
    <div class="my_table">

      <MyTableColumn v-if="columnShow" v-model="newTable" />
      <!-- table -->
      <el-table
        ref="multipleTable"
        v-loading="loading"
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
      <div v-if="tableTotal.length>0" class="totla">
        <span>合计：</span>
        <ul>
          <li v-for="item in tableTotal" :key="item.label">{{ item.label }}：{{ Number.isInteger(item.value)?item.value:item.value.toFixed(3) }}</li>
        </ul>
      </div>
      <div class="pagintion">
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
        <el-button plain icon="el-icon-refresh" title="刷新" @click="searchTable" />
      </div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import { deepClone } from '@/utils';

export default {
  name: 'MyTables',
  props: {
    url: { // 列表url
      type: String,
      required: true
    },
    searchShow: { // 是否展示搜索
      type: Boolean,
      default: true
    },
    resetShow: { // 是否展示搜索的重置按钮
      type: Boolean,
      default: true
    },
    labelWidth: { // 搜索form的labelWidth
      type: String,
      default: '70px',
    },
    formItemWidth: { // 搜索form的labelWidth
      type: String,
      default: 'auto'
    },
    searchForm: { // 搜索form数据
      type: Object,
      default: () => { return {}; },
    },
    searchData: { // 搜索form数据
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
    tableTotal: { // 表格合计模块
      type: Array,
      default: () => [],
    },
    totalFalse: { // 表格合计数据是否需要请求接口
      type: Boolean,
      default: true,
    },
    pagination: { // 是否展示表格分页模块
      type: Boolean,
      default: true,
    },
    columnData: { // 表头数据
      type: Array,
      default: () => [{ prop: '', label: '' }],
    },
    resetStatus: { // 数据重置状态
      type: Boolean,
      default: false
    },
    resetBtnClick: { // 查询 重置 状态
      type: Boolean,
      default: false
    },
    selectInit: {// 选中的数据回显勾选
      type: Array,
      default: () => [],
    },
    selectionData: { // 选中的数据回显勾选
      type: Array,
      default: () => [],
    },
    selectType: { // 选中的数据的页面
      type: String,
      default: 'init'
    },
  },
  data() {
    return {
      searchFormDef: {},
      pageSize: 15,
      tableData: [],
      paginationObj: {
        total: 0,
        per_page: 0,
        total_pages: 1,
      },
      pageSizes: [15, 30, 50],
      newTable: [],
      loading: false,
      loadingBtn: false,
      ids: '',
      datetimerange: [],
      weight1: null,
      weight2: null,

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
  watch: {
    tableData: {
      handler(n) {
        this.$emit('change', n);
        if (this.totalFalse) {
          this.tableTotal.map(item => {
            item.value = 0;
            n.map(items => {
              item.value += parseFloat(items[item.prop]);
            });
          });
        }
      },
      deep: true
    },
    'searchForm.warehousing_settlement_weight': {
      handler(n) {
        if (!n) { this.weight1 = this.weight2 = ''; }
      },
      deep: true
    },
    selectionData: {
      handler(n, o) {
        if (n.length > 0 && this.selectType === 'receiptCheck') {
          this.$refs.multipleTable.clearSelection();
          this.$refs.multipleTable.toggleRowSelection(n[0], true);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.searchFormDef = deepClone(this.searchForm);
  },
  created() {
    this.getList(this.searchForm);
    this.newTable = this.columnData.map((item, i) => {
      if (item.checked !== false) {
        this.$set(this.columnData[i], 'checked', true);
      }
      return item;
    });
    this.toggleSelection(this.selectInit);
  },
  methods: {
    // 获取列表
    async getList(params, url) {
      this.$emit('update:resetStatus', false);
      const pages = { page: 1, per_page: 15, };
      params = Object.assign(pages, params);
      url = url || this.url;
      this.loading = true;
      const res = await this.request({ url: url, method: 'get', params: params });
      this.tableData = res.data;
      this.paginationObj = res.meta.pagination;
      this.loading = false;
      this.loadingBtn = false;
      this.$emit('update:resetStatus', true); // 数据已重置
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
      return res.data;
    },
    // 编辑列表 => 获取详情
    async edit(id, url) {
      url = url || this.url;
      const res = await this.request({ url: url + '/' + id, method: 'get' });
      return res.data;
    },
    // 多选
    selectionChange(selections, param) {
      this.ids = selections
        .map((item) => {
          return item[param];
        })
        .join(',');
    },
    // 删除表格数据
    delete(ids, url) {
      ids = ids || this.ids;
      url = url || this.url;
      if (!ids) {
        this.$message({
          type: 'error',
          message: '未勾选数据',
        });
        return;
      }
      this.$confirm('您确定要删除该数据吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.request({ url: url + '/' + ids, method: 'delete' }).then(async(res) => {
            this.searchTable();
            this.$message({ type: 'success', message: '删除成功', });
          });
        })
        .catch(() => {
          this.$message({ type: 'info', message: '取消删除', });
        });
    },
    // 查询
    async searchTable() {
      this.loadingBtn = true;
      const res = await this.getList(this.searchForm);
      this.$emit('resetBtnFun', res);
    },
    // 重置
    async reset() {
      this.$emit('update:searchForm', deepClone(this.searchFormDef));
      const res = await this.getList(this.searchFormDef);
      this.$emit('resetBtnFun', res);
    },
    // 选择页码=>当前页
    async handleCurrentChange(currentPage) {
      this.searchForm.page = currentPage;
      this.searchForm.per_page = this.pageSize;
      const res = await this.getList(this.searchForm);
      this.$emit('resetBtnFun', res);
    },
    // 页码展示条数
    async handleSizeChange(pageSize) {
      this.searchForm.page = 1;
      this.searchForm.per_page = pageSize;
      const res = await this.getList(this.searchForm);
      this.$emit('resetBtnFun', res);
    },
    toggleSelection(rows) { // 表格选中数据
      if (rows) {
        this.$nextTick(() => {
          rows.forEach(item => {
            this.$refs.multipleTable.toggleRowSelection(item, true);
          });
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    /**
     * // 数字字符输入验证
     * @param {string} value - 输入的值
     * @param {string} name - 匹配的对象属性
     */
    inputNY(value, name) {
      this.searchForm[name] = ('' + value).replace(/[^\w]/ig, '') || '';
    },
    /**
     * // 数字整数输入验证
     */
    inputI(value, name) {
      this.searchForm[name] = Number(('' + value).replace(/[^\d]/ig, '') || null);
    },
    /**
     * // 数字输入验证
     * @param {string} num - 小数点后保留几位
     */
    inputF(value, name, num) {
      num = num || 3;
      const match = new RegExp('^\\d*(\.?\\d{0,' + num + '})', 'g');
      this.searchForm[name] =
        ('' + value) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, '') // 第二步：把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(match)[0] || ''; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到3位小数
    },
    // 选择时间区间
    timeChange(val, param) {
      this.searchForm[param] = val ? JSON.stringify(val) : '';
    },
    // 双 输入框
    inputDobule(val, param) {
      const weight1 = this.weight1 ? this.weight1 : 0;
      const weight2 = this.weight2 ? this.weight2 : 0;
      this.searchForm[param] = JSON.stringify([weight1, weight2]);
    },
    // MySelect下拉回调
    returnLabel(label) {
      console.log(label);
    },
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
    ::v-deep.el-date-editor{
      width: 183px;
        input{
          padding: 0 30px;
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
    .weight{
      .el-input{width: 80px;}
    }
  }
</style>
