<template>
  <EditForm
    v-bind="$attrs"
    :title=" $attrs.status=== 1 ? '添加用户' : '修改用户'"
    :form="form"
    :rules="rules"
    :form-data="formData"
    label-width="80px"
    @close-dialog="$emit('close-dialog', false)"
    @init-table="$emit('init-table')"
  />
</template>

<script>
export default {
  name: 'Add',
  data() {
    return {
      form: {
        username: '',
        company_code: '',
        staff_code: '',
        name: '',
        password: '',
        mobile: '',
        remark: '',
        rolesIds: [],
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        rolesIds: [
          { required: true, message: '请输入角色标识', trigger: 'blur' },
        ],
      },
      formData: [
        { type: 'input', label: '用户名', prop: 'username', },
        { type: 'input', label: '姓名', prop: 'name', },
        { type: 'inputNY', label: '密码', prop: 'password', },
        { type: 'inputI', label: '手机号', prop: 'mobile', },
        { type: 'input', label: '描述', prop: 'remark', },
        { type: 'MySelect', label: '拥有角色', prop: 'rolesIds', name: 'roles', filterable: true, multiple: true, },

      ],
    };
  },
  async created() {
    if (this.$attrs.status !== 1) {
      const res = await this.request({ url: this.$attrs.url + '/' + this.$attrs.tableid, method: 'get' });
      const param = (({
        username,
        name,
        password,
        mobile,
        remark,
        rolesIds,
      }) => ({
        username,
        name,
        password,
        mobile,
        remark,
        rolesIds,
      }))(res.data);
      this.form = param;
    }
  },
};
</script>
<style lang="scss">
.user{
  .el-select{
    width: 200px ;
  }
}
</style>
