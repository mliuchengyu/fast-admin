<template>
  <el-dialog v-bind="$attrs" :visible="visible" :width="width" center :close-on-click-modal="false" :close-on-press-escape="false" @close="showClose">
    <slot></slot>

    <span v-if="seeBtn" slot="footer" class="dialog-footer">
      <el-button v-if="dialogClose" @click="showClose">取 消</el-button>
      <el-button type="primary" @click="submitDialog">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'MyDialog',
  props: {
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
    }
  },
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    showClose() {
      this.$emit('close-dialog', false);
    },
    submitDialog() {
      this.$emit('submit-dialog', true);
    },
  },
};
</script>
<style>
.el-dialog {
  min-width: 570px;
  border-radius: 5px;
  overflow: hidden;
}
.el-dialog__body{
  max-height: 480px;
  overflow: auto;
}
.el-dialog__header{
  border-bottom: 1px solid #eee;
  padding: 10px;
  background: #f8f8f8;
   text-align: left ;
}
 .el-dialog__title {
    line-height: 24px;
    font-size: 16px;
    color: #303133;
    padding: 0 0 0 20px;

  }
.el-dialog__headerbtn{
font-size: 20px;
top: 12px;
    right: 25px;
}
.el-dialog__footer{
  border-top: 1px solid #eee;
  padding: 10px 25px;
  text-align: right !important;
}
</style>
