<template>
  <MyDialog width="750px" title="材积" :append-to-body="appendToBody" :see-btn="!disabled" @submit-dialog="onSubmit" @close-dialog="onClose">
    <el-button v-if="!disabled" type="primary" class="add" @click="tableAdd"><span class="el-icon-plus"></span> 添加</el-button>
    <el-table :data="newTable" border show-summary :header-cell-class-name="must">
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column prop="warehousing_volume_actual_weight" label="总实重">
        <template slot-scope="scope">
          <el-input v-if="!disabled" v-model="scope.row.warehousing_volume_actual_weight" type="text" @input="inputF($event,'warehousing_volume_actual_weight',3,scope.$index)" @change="total(scope.$index)" />
          <span v-else> {{ scope.row.warehousing_volume_actual_weight }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="warehousing_volume_length" label="长">
        <template slot-scope="scope">
          <el-input v-if="!disabled" v-model="scope.row.warehousing_volume_length" type="text" @input="inputF($event,'warehousing_volume_length',3,scope.$index)" @change="total(scope.$index)" />
          <span v-else> {{ scope.row.warehousing_volume_length }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="warehousing_volume_width" label="宽">
        <template slot-scope="scope">
          <el-input v-if="!disabled" v-model="scope.row.warehousing_volume_width" type="text" @input="inputF($event,'warehousing_volume_width',3,scope.$index)" @change="total(scope.$index)" />
          <span v-else> {{ scope.row.warehousing_volume_width }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="warehousing_volume_high" label="高">
        <template slot-scope="scope">
          <el-input v-if="!disabled" v-model="scope.row.warehousing_volume_high" type="text" @input="inputF($event,'warehousing_volume_high',3,scope.$index)" @change="total(scope.$index)" />
          <span v-else> {{ scope.row.warehousing_volume_high }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="warehousing_volume_number" label="件数" width="70">
        <template slot-scope="scope">
          <el-input v-if="!disabled" v-model.number="scope.row.warehousing_volume_number" type="text" @change="total(scope.$index)" />
          <span v-else> {{ scope.row.warehousing_volume_number }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="warehousing_volume_material_area" label="材积" width="90">
        <template slot-scope="scope">
          <span v-show="!isNaN(scope.row.warehousing_volume_material_area)">{{ scope.row.warehousing_volume_material_area }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!disabled" label="操作" width="60" align="center">
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
  name: 'Division',
  model: {
    prop: 'value',
    event: 'return-table'
  },
  props: {
    value: {
      type: Array,
      default: () => [{
        warehousing_waybill_no: this.no,
        warehousing_volume_actual_weight: '0.000',
        warehousing_volume_length: '',
        warehousing_volume_width: '',
        warehousing_volume_high: '',
        warehousing_volume_number: 1,
        warehousing_volume_material_area: '',
      }]
    },
    square: {
      type: Number,
      default: 0,
      // required: false,
    },
    appendToBody: { // Mydialog 是否插入body
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    no: {
      type: String,
      default: '',
    }
  },
  computed: {
    newTable() {
      return deepClone(this.value);
    }
  },
  watch: {
    square(n) {
      if (n) {
        this.totals(this.value);
      }
    },
    deep: true
  },
  methods: {
    async onSubmit() {
      let cj = 0; let sz = 0; let js = 0; // 材积  实重 件数
      let off = true;
      this.newTable.map(item => {
        if (!(item.warehousing_volume_length && item.warehousing_volume_width && item.warehousing_volume_high && item.warehousing_volume_number)) {
          off = false;
          this.$message({
            type: 'error',
            message: '表格所有输入框都不能为空',
          });
          return false;
        }
        if (item.warehousing_volume_material_area !== null && !isNaN(item.warehousing_volume_material_area || item.warehousing_volume_material_area === 0)) {
          cj += parseFloat(item.warehousing_volume_material_area);
          sz += parseFloat(item.warehousing_volume_actual_weight);
          js += parseInt(item.warehousing_volume_number);
        }
      });
      if (off) {
        cj = cj.toFixed(3);
        sz = sz.toFixed(3);
        if (cj && sz && js) {
          this.$emit('return-Array', [cj, sz, js]);
        } else {
          this.$emit('return-Array', [0.000, 0.000, 0.000]);
        }
        this.$emit('return-table', this.newTable);
        this.$emit('close-dialog', false);
      }
    },
    onClose() {
      this.$emit('close-dialog', false);
    },
    // 自动计算材积
    total(i) {
      const t = this.newTable[i];
      const l = t.warehousing_volume_length;
      const w = t.warehousing_volume_width;
      const h = t.warehousing_volume_high;
      const n = t.warehousing_volume_number;
      if (!isNaN(l) && !isNaN(w) && !isNaN(h) && !isNaN(n) && l !== null && w !== null && h !== null && n !== null) {
        t.warehousing_volume_material_area = (
          l * w * h * n / parseFloat(this.square)
        );
        t.warehousing_volume_material_area = (parseFloat(t.warehousing_volume_material_area.toString()) + 0.0004);
        t.warehousing_volume_material_area = Number(t.warehousing_volume_material_area).toFixed(3); // 补足位数
      }
    },
    totals(n) {
      const l = 'warehousing_volume_length';
      const w = 'warehousing_volume_width';
      const h = 'warehousing_volume_high';
      const num = 'warehousing_volume_number';
      n = n.map(item => {
        if (!isNaN(item[l]) && !isNaN(item[w]) && !isNaN(item[h]) && !isNaN(item[num]) && item[l] !== null && item[w] !== null && item[h] !== null && item[num] !== null) {
          item.warehousing_volume_material_area = (
            item[l] * item[w] * item[h] * item[num] / parseFloat(this.square)
          );
          item.warehousing_volume_material_area = (parseFloat(item.warehousing_volume_material_area.toString()) + 0.0004);
          item.warehousing_volume_material_area = Number(item.warehousing_volume_material_area).toFixed(3); // 补足位数
        }
        return item;
      });
    },
    // 添加一行表格数据
    tableAdd() {
      this.newTable.push({
        warehousing_waybill_no: this.no,
        warehousing_volume_actual_weight: '0.000',
        warehousing_volume_length: '',
        warehousing_volume_width: '',
        warehousing_volume_high: '',
        warehousing_volume_number: 1,
        warehousing_volume_material_area: '',
      });
    },
    tableDel(i) {
      this.newTable.splice(i, 1);
    },
    // 表格加红星
    must(obj) {
      if (obj.columnIndex !== 0 && obj.columnIndex !== 6 && obj.columnIndex !== 7) {
        return 'must';
      }
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
.el-form-item--mini {
  ::v-deep.el-form-item__label {
    font-weight: normal;
  }
}
.delete{
  color: red;
  font-size: 20px;
  padding: 0;
  width: 20px;
  min-width: auto;
}
.add{
  padding:5px 10px;
  // border:1px solid #1890FF;
  margin-bottom: 10px;
}
::v-deep.el-table {
  .el-input__inner{
    padding: 0 5px;
  }
  th.must>.cell:before {
    content: '*';
    color: #ff1818;
  }
}
</style>
