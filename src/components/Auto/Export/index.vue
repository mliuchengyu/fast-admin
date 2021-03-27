<template>
  <span class="export">
    <el-dropdown style="margin-right:10px;" @command="batch">
      <el-button type="primary">
        {{ text }}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="csv">导出csv</el-dropdown-item>
        <el-dropdown-item command="xls">导出xls</el-dropdown-item>
        <el-dropdown-item command="xlsx">导出xlsx</el-dropdown-item>
        <el-dropdown-item command="set">导出设置</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <MyDialog v-if="dialogShow" title="导出设置" @submit-dialog="submit" @close-dialog="close">
      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th width="20" align="center"><el-checkbox v-model="qx_checked" /></th>
            <th width="110" align="left">原字段标题</th>
            <th width="200" align="left">自定义字段标题</th>
          </tr>
        </thead>
        <draggable v-model="dataArr" element="tbody">
          <tr v-for="(item,id) in dataArr" :key="id">
            <td align="center"><el-checkbox v-model="item.checked" /></td>
            <td>{{ item.label }}</td>
            <td><el-input v-model="item.headings" class="td_input" type="text" /></td>
          </tr>
        </draggable>
      </table>
    </MyDialog>
  </span>
</template>

<script>
import { deepClone } from '@/utils';
import draggable from 'vuedraggable';
export default {
  name: 'Export',
  components: {
    draggable,
  },
  props: {
    columnData: {
      type: Array,
      required: true
    },
    text: {
      type: String,
      default: '导出'
    },
    url: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      default: '数据列表'
    },
    searchForm: {
      type: Object,
      default: () => { return {}; }
    }
  },
  data() {
    return {
      dataArr: [],
      dialogShow: false,
      qx_checked: false,
    };
  },
  watch: {
    qx_checked(n) {
      this.dataArr.map(item => {
        item.checked = n;
      });
    },
  },
  created() {
    if (this.columnData) {
      let newArr = deepClone(this.columnData.filter(item => {
        return item.attr.prop;
      }));
      newArr = newArr.map(item => {
        // 订单列表 order/list
        if (item.attr.prop === 'customer_name') item.attr.prop = 'customer_id';
        if (item.attr.prop === 'channel_name') item.attr.prop = 'channel_id';
        if (item.attr.prop === 'country_name') item.attr.prop = 'country_id';
        if (item.attr.prop === 'customer_name') item.attr.prop = 'customer_id';
        if (item.attr.prop === 'recipient_name') item.attr.prop = 'recipient_id';
        if (item.attr.prop === 'channel_category_name') item.attr.prop = 'channel_category_id';
        if (item.attr.prop === 'order_recipient_country_name') item.attr.prop = 'order_recipient_country_id';
        // 运单列表 service/wbList
        if (item.attr.prop === 'problem_category_name') item.attr.prop = 'problem_category_id';
        if (item.attr.prop === 'goods_spec_name') item.attr.prop = 'goods_spec_id';
        if (item.attr.prop === 'salesman_name') item.attr.prop = 'salesman_id';
        // 出仓列表 operation/outwarehouse
        if (item.attr.prop === 'site_name') item.attr.prop = 'site_id';
        if (item.attr.prop === 'agent_name') item.attr.prop = 'agent_id';
        if (item.attr.prop === 'producer_name') item.attr.prop = 'producer_id';
        // 入仓列表 operation/warehousing
        if (item.attr.prop === 'csm_name') item.attr.prop = 'csm_id';
        if (item.attr.prop === 'country_chinese') item.attr.prop = 'country_id';
        item.attr.headings = item.attr.label;
        item.attr.filter = item.attr.prop;
        item.attr.checked = item.checked !== false;
        delete item.attr.sortable;
        delete item.attr.width;
        delete item.attr.prop;
        return item.attr;
      });
      this.dataArr = newArr;
    }
  },
  methods: {
    async batch(command) {
      if (command === 'set') {
        this.dialogShow = true;
      } else {
        const arr = deepClone(this.dataArr);
        const data = JSON.stringify(arr.filter(item => {
          return item.checked;
        }).map(item => {
          delete item.prop;
          delete item.checked;
          delete item.label;
          return item;
        }));
        let param_search = '';
        Object.keys(this.searchForm).map(item => {
          let val = '';
          if (this.searchForm[item] === null) {
            val = '';
          } else {
            val = this.searchForm[item];
          }
          param_search += '&' + item + '=' + val;
        });
        console.log(`${process.env.VUE_APP_BASE_API}/${this.url}?fileName=${this.fileName}&writerType=${command}&data=${data}${param_search}`);
        window.location.href = `${process.env.VUE_APP_BASE_API}/${this.url}?fileName=${this.fileName}&writerType=${command}&data=${data}${param_search}`;
      }
    },
    submit() {
      this.dialogShow = false;
    },
    close() {
      this.dialogShow = false;
    }
  },
};
</script>

<style scoped lang="scss">
.export{
  margin-left: 10px;
  table{
    border: 1px solid #eee;
    tr{
      cursor:move;
      th{
        line-height: 30px;
        font-weight: normal;
        font-size: 14px;
        border-right:1px solid #eee ;
        padding: 0 10px;
        box-sizing: border-box;
      }
      td{
        border-right:1px solid #eee ;
        border-top:1px solid #eee ;
        padding: 0 10px;
        box-sizing: border-box;
        ::v-deep.td_input{
          margin: 2px 0;
          .el-input__inner{
            height: 22px;
            line-height: 22px;
            padding: 0 10px;
          }
        }
      }
      th:last-child,td:last-child{
        border-right:none ;
      }
    }
  }
}
</style>
