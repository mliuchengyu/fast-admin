<!-- 搜索表单 -->
<template>
  <el-dialog
    v-bind="$attrs"
    :visible="true"
    :width="width"
    center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onClose"
  >
    <el-form ref="editForm" :label-width="labelWidth" :model="form" :rules="rules" :inline="inline">
      <template v-for="item in formData">
        <!-- 标题 -->
        <div v-if="item.type==='title'" :key="item.title" class="h1">{{ item.title }}</div>
        <el-form-item v-if="item.type==='diyform' && item.prop && !item.hide" :key="item.prop" :prop="item.prop" :style="{width:item.width||formItemWidth}">
          <!-- 自定义渠道 -->
          <span type="text" :class="['label_span',item.notstart?'not_label_span':'']" @click="item.show=true">{{ item.label }}</span>
          <MySelect v-model="form[item.prop]" v-bind="item" :init="item.init || true" @returnLabel="(val)=>{returnLabel(val,item.value || null)}" />
        </el-form-item>
        <el-form-item v-else-if="item.type==='slot'" :key="item.name" :label="item.label" :prop="item.prop" :style="{width:item.width||formItemWidth}">
          <!-- 自定义带form-item的具名插槽 -->
          <slot v-if="item.type==='slot'" :name="item.name"> </slot>
        </el-form-item>
        <el-form-item v-else-if="item.prop && !item.hide" :key="item.label" :label="item.label" :prop="item.prop" :style="{width:item.width||formItemWidth}">
          <!-- 输入框 -->
          <el-input
            v-if="item.type==='input'"
            v-model="form[item.prop]"
            v-bind="item"
            clearable
            :style="{width:item.width}"
          />
          <!-- 输入框 只能数字和字母-->
          <el-input
            v-if="item.type==='inputNY'"
            v-model="form[item.prop]"
            v-bind="item"
            clearable
            :style="{width:item.width}"
            @input="inputNY($event,item.prop)"
          />
          <!-- 输入框 整数number-->
          <el-input
            v-if="item.type==='inputI'"
            v-model.number="form[item.prop]"
            v-bind="item"
            clearable
            :style="{width:item.width}"
            @input="inputI($event,item.prop)"
          />
          <!-- 输入框 小数number-->
          <el-input
            v-if="item.type==='inputF'"
            v-model.trim="form[item.prop]"
            v-bind="item"
            clearable
            :style="{width:item.width}"
            @input="inputF($event,item.prop,item.num)"
          />

          <!-- 文本域 -->
          <el-input
            v-if="item.type==='textarea'"
            v-model="form[item.prop]"
            v-bind="item"
            clearable
            type="textarea"
            :style="{width:item.width}"
          />
          <!-- 下拉框 -->
          <el-select
            v-if="item.type==='select'"
            v-model="form[item.prop]"
            v-bind="item"
          >
            <el-option v-for="op in item.options" :key="op.value" :label="op.label" :value="op.value" />
          </el-select>
          <!-- 单选 -->
          <el-radio-group
            v-if="item.type==='radio'"
            v-model="form[item.prop]"
            v-bind="item"
            clearable
          >
            <el-radio v-for="ra in item.options" :key="ra.value" :label="ra.value">{{ ra.label }}</el-radio>
          </el-radio-group>
          <!-- 单选按钮 -->
          <el-radio-group
            v-if="item.type==='radioButton'"
            v-model="form[item.prop]"
            v-bind="item"
            clearable
          >
            <el-radio-button v-for="ra in item.options" :key="ra.value" :label="ra.value">{{ ra.label }}</el-radio-button>
          </el-radio-group>
          <!-- 复选框 -->
          <el-checkbox-group
            v-if="item.type==='checkbox'"
            v-model="form[item.prop]"
            v-bind="item"
            clearable
          >
            <el-checkbox v-for="ch in item.options" :key="ch.value" :label="ch.value">{{ ch.label }}</el-checkbox>
          </el-checkbox-group>
          <!-- 时间 -->
          <el-time-select
            v-if="item.type==='time'"
            v-model="form[item.prop]"
            v-bind="item"
            type=""
            clearable
            value-format="HH:mm:ss"
          />
          <!-- 日期 -->
          <el-date-picker
            v-if="item.type==='date'"
            v-model="form[item.prop]"
            v-bind="item"
            clearable
            value-format="yyyy-MM-dd"
          />
          <!-- 日期时间 -->
          <el-date-picker
            v-if="item.type==='datetime'"
            v-model="form[item.prop]"
            v-bind="item"
            type="datetime"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          <!-- 自定义下拉选择 -->
          <!-- <MySelect
            v-if="item.type==='MySelect'"
            v-model="form[item.prop]"
            v-bind="item"
            :disabled="item.disabled"
            :name="item.name"
            :param="item.param"
            :multiple="item.multiple"
            :collapse-tags="item.collapseTags"
            :clearable="item.clearable"
            :filterable="item.filterable"
            @returnLabel="(val)=>{returnLabel(val,item.value || null)}"
          /> -->
          <MySelect
            v-if="item.type==='MySelect'"
            v-model="form[item.prop]"
            v-bind="item"
            @returnLabel="(val)=>{returnLabel(val,item.value || null)}"
          />

        </el-form-item>

        <!-- 自定义具名插槽 不含el-form-item-->
        <slot v-if="item.type==='noFormitem'" :name="item.name"> </slot>
        <!-- 自定义搜索客户姓名 -->
        <slot v-if="item.type==='cusmoter'" name="cusmoter"> </slot>
        <!-- 自定义双渠道 -->
        <slot v-if="item.type==='channels'" name="channels"> </slot>

      </template>
      <!-- 默认插槽 -->
      <slot> </slot>
      <!-- 渠道轨迹列表 -->
      <slot name="categorylist"> </slot>
    </el-form>
    <span v-if="seeBtn" slot="footer" class="dialog-footer">
      <el-button v-if="dialogClose" @click="onClose">取 消</el-button>
      <el-button type="primary" :loading="submitloads" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditForm',
  props: {
    submitload: {
      type: Boolean,
      default: false,
    },
    dialogClose: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '30%',
    },
    seeBtn: {
      type: Boolean,
      default: true,
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    formItemWidth: {
      type: String,
      default: '100%'
    },
    formData: {
      type: Array,
      default: () => []
    },
    form: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: null
    },
    inline: {
      type: Boolean,
      default: false,
    },
    noInit: {
      type: Boolean,
      default: true,
    },
    submit: {
      type: Boolean,
      default: true,
    },
    diySubmit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    submitloads: {
      get() {
        return this.submitload;
      },
      set(n) {
        return n;
      }
    }
  },

  methods: {
    async onSubmit() {
      if (this.diySubmit) {
        this.$emit('diySubmit');
      } else {
        if (!this.submit) {
          this.$emit('submit');
        }
        const params = this.$attrs.status === 1
          ? { url: this.$attrs.url, method: 'post', data: this.form }
          : { url: this.$attrs.url + '/' + this.$attrs.tableid, method: 'put', data: this.form };
        this.submitloads = true;
        this.request(params).then(res => {
          if (res !== undefined) {
            if (this.noInit) this.$emit('init-table');
            this.$message({
              type: 'success',
              message: this.$attrs.status === 1 ? '添加成功' : '修改成功',
            });
            this.$emit('close-dialog', false);
            this.submitloads = false;
          }
        }).catch(err => {
          console.log(err);
          this.submitloads = false;
        });
      }
    },
    onClose() {
      this.$emit('close-dialog', false);
    },
    /**
     * // 数字字符输入验证
     * @param {string} value - 输入的值
     * @param {string} name - 匹配的对象属性
     */
    inputNY(value, name) {
      this.form[name] = ('' + value).replace(/[^\w]/ig, '') || '';
    },
    /**
     *  数字整数输入验证
     */
    inputI(value, name) {
      this.form[name] = Number(('' + value).replace(/[^\d]/ig, '') || null);
    },
    /**
     * // 数字输入验证
     * @param {string} num - 小数点后保留几位
     */
    inputF(value, name, num) {
      num = num || 3;
      const match = new RegExp('^\\d*(\.?\\d{0,' + num + '})', 'g');
      this.form[name] =
        ('' + value) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, '') // 第二步：把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(match)[0] || ''; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到3位小数
    },

    // MySelect下拉回调
    returnLabel(val, name) {
      if (name) this.form[name] = val;
    },
  },
};

</script>

<style scoped lang="scss">
.el-form{
  .h1 {
    font-weight: bold;
    margin-bottom: 10px;
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
          padding: 0 0 0 30px;
        }
    }
  }
  .label_span {
    font-size: 14px;
    width: 160px;
    line-height: 28px;
    float: left;
    color: #409eff;
    cursor: pointer;
  }
  .label_span::before {
    content: '*';
    color: red;
    font-size: 12px;
    margin-right: 5px;
  }
  .not_label_span::before {
    content: '';
  }
}
</style>
