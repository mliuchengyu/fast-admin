<template>
  <EditForm
    v-bind="$attrs"
    :title=" $attrs.status=== 1 ? '添加角色' : '修改角色'"
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
        name: '',
        slug: '',
        description: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        slug: [
          { required: true, message: '请输入角色标识', trigger: 'blur' },
        ],
      },
      formData: [
        { type: 'input', label: '角色名称', prop: 'name', },
        { type: 'input', label: '角色标识', prop: 'slug', },
        { type: 'input', label: '角色描述', prop: 'description', },
      ],
    };
  },
  async created() {
    if (this.$attrs.status !== 1) {
      const res = await this.request({ url: this.$attrs.url + '/' + this.$attrs.tableid, method: 'get' });
      const param = (({
        name,
        slug,
        description,
      }) => ({
        name,
        slug,
        description,
      }))(res.data);
      this.form = param;
    }
  },
};
</script>

