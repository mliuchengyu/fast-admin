<template>
  <MyDialog width="850px" title="其他费用" :append-to-body="appendToBody" :see-btn="!disabled" @submit-dialog="onSubmit" @close-dialog="onClose">
    <el-button v-if="!disabled" type="primary" class="add" @click="tableAdd"><span class="el-icon-plus"></span> 添加</el-button>
    <el-table :data="newTable" border show-summary>
      <el-table-column type="index" label="序号" />
      <el-table-column label="费用类别">
        <template slot-scope="scope">
          <!-- 下拉框 -->
          <MySelect
            v-if="!disabled"
            v-model="scope.row.category"
            :clearable="false"
            name="expense_category"
          />
          <span v-else> {{ scope.row.category_name }} </span>
        </template>
      </el-table-column>
      <el-table-column label="币别">
        <template slot-scope="scope">
          <el-popover
            v-if="!disabled"
            v-model="scope.row.show"
            placement="right"
            title="汇率换算"
            width="200"
            trigger="click"
          >
            <div class="popover_div">
              <span>汇率：</span>
              <el-input v-model="scope.row.rate" type="text" @input="inputF($event,'rate',3,scope.$index)" />
            </div>
            <div class="popover_div">
              <span>金额：</span>
              <el-input v-model="scope.row.money" type="text" @input="inputF($event,'money',3,scope.$index)" />
            </div>
            <div style="text-align: right; margin: 0">
              <el-button @click="scope.row.show = false">取消</el-button>
              <el-button type="primary" @click="popSubmit(scope.$index)">确定</el-button>
            </div>
            <MySelect
              slot="reference"
              v-model="scope.row.csm_id"
              name="currency"
              @returnSelectId="(val)=>{mySelectChange(val,scope.$index)}"
            />
          </el-popover>
          <span v-else> {{ scope.row.csm_name }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="cost" label="费用">
        <template slot-scope="scope">
          <el-input v-if="!disabled" v-model="scope.row.cost" type="text" @input="inputF($event,'cost',3,scope.$index)" />
          <span v-else> {{ scope.row.cost }} </span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="220">
        <template slot-scope="scope">
          <el-input v-if="!disabled" v-model="scope.row.desc" type="text" class="textarea" />
          <span v-else> {{ scope.row.desc }} </span>
        </template>
      </el-table-column>
      <el-table-column v-if="!disabled" label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" class="delete" @click="tableDel(scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
  </MyDialog>
</template>

<script>
import { deepClone } from '@/utils';

export default {
  name: 'Expenses',
  model: {
    prop: 'value',
    event: 'changevalue'
  },
  props: {
    value: {
      type: Array,
      default: () => [
        { category: 1,
          csm_id: 1,
          csm_name: '',
          cost: null,
          desc: '',
          rate: null,
          money: null,
          show: false,
        }
      ]
    },
    appendToBody: { // Mydialog 是否插入body
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      other_expenses: 0,
      visible: false,
      form: {
        category: 1,
        csm_id: 1,
        csm_name: '',
        cost: null,
        desc: '',
        rate: null,
        money: null,
        show: false,
      },
    };
  },
  computed: {
    newTable() {
      return deepClone(this.value);
    }
  },
  created() {
    if (this.showStatus === 1) {
      this.formData = [];
      this.columnData.splice(this.columnData.length - 1, 1);
    }
  },
  methods: {
    popSubmit(i) { // 币种汇率换算
      if (this.newTable[i].rate && this.newTable[i].money && this.newTable[i].rate !== 0 && this.newTable[i].money !== 0) {
        this.newTable[i].cost = this.newTable[i].rate * this.newTable[i].money;
        this.newTable[i].show = false;
      } else {
        this.$message({ type: 'error', message: '汇率、金额不能为空', });
      }
    },
    mySelectChange(val, i) { // 币种选择回调
      console.log(val, i);
      if (val && val !== 1) {
        this.newTable[i].show = true;
        // this.$set(this.newTable, 'show', true);
      }
    },
    // 添加一行表格数据
    tableAdd() {
      this.newTable.push({
        category: 1,
        csm_id: 1,
        csm_name: '',
        cost: null,
        desc: '',
        rate: null,
        money: null,
        show: false,
      });
    },
    tableDel(i) { // 删除表格数据
      this.newTable.splice(i, 1);
    },
    async onSubmit() {
      let off = true;
      this.newTable.map(item => {
        if (!item.cost || !item.csm_id) {
          off = false;
          return false;
        }
        delete item.rate;
        delete item.money;
        delete item.show;
        delete item.category_name;
      });
      if (off) {
        this.$emit('changevalue', deepClone(this.newTable));
        this.other_expenses = 0;
        if (this.newTable.length > 0) {
          this.newTable.map(item => {
            this.other_expenses += parseFloat(item.cost || 0);
          });
        }
        this.$emit('change', this.other_expenses);
        this.$emit('close-dialog', false);
      } else {
        this.$message({ type: 'error', message: '费用、币别不能为空', });
      }
    },
    onClose() {
      this.$emit('close-dialog', false);
    },
    /**
     * // 数字输入验证
     * @param {string} num - 小数点后保留几位
     */
    inputF(value, name, num, i) {
      num = num || 3;
      const match = new RegExp('^\\d*(\.?\\d{0,' + num + '})', 'g');
      this.newTable[i][name] =
        ('' + value) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, '') // 第二步：把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(match)[0] || ''; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到3位小数
    },
  },
};
</script>

<style scoped lang="scss">
  ::v-deep.search{
    width: 48%;
    margin:0 10px 18px 0 ;
    .el-form-item{
      width: 100% !important;
    }
    .search_span{
      right: 0;
      left: 232px;
    }

  }
  ::v-deep.el-dialog__wrapper{
    .el-form{
      .my_table{
        padding-top: 0;
      }
    }
    .el-input,.el-textarea,.el-select{
      width: 120px !important;
    }
  }
  .submit{
    margin-bottom: 25px;
  }
.el-form-item--mini {
  ::v-deep.el-form-item__label {
    font-weight: normal;
  }
}
.delete{
  color: red;
  font-size: 20px;
  padding: 0;
}
.add{
  padding:5px 10px;
  // border:1px solid #1890FF;
  margin-bottom: 10px;
}
.popover_div{
  display: flex;
  margin-bottom: 10px;
  span{
    width: 80px;
    line-height: 28px;
  }
}
</style>
