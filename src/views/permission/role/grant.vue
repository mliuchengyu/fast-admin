<template>
  <el-card class="full-height full-width grant">
    <h1>编辑角色权限</h1>
    <el-tree
      ref="tree"
      :data="permissionList"
      :default-checked-keys="permissions"
      show-checkbox
      node-key="id"
      :props="{children: 'children',label: 'label'}"
      default-expand-all
      highlight-current
      :indent="16"
    />
    <div class="submit">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="" @click="$router.go(-1)">返回</el-button>
    </div>
  </el-card>
</template>

<script>
import { getPermisssionsNodes } from '@/api/permission';
import { postRoleApply } from '@/api/role';

export default {
  name: 'Grant',
  data() {
    return {
      permissionList: [],
      permissions: [],
    };
  },
  created() {
    console.log(this.$route.query);
    this.permissions = this.$route.query.permissions;
    this.getPermisssionsNodes();
  },
  methods: {
    async getPermisssionsNodes() {
      const res = await getPermisssionsNodes();
      // 循环过滤多余的childern
      const delC = (arr) => {
        return arr.map(item => {
          if (item.children.length > 0) {
            delC(item.children);
          } else {
            delete item.children;
          }
          item.id = item.value;
          return item;
        });
      };
      this.permissionList = delC(res);
    },
    // 保存
    async submit() {
      console.log(this.$refs.tree.getCheckedKeys());
      const param = {
        permissions: this.$refs.tree.getCheckedKeys()
      };
      const id = this.$route.query.id;
      // if (this.permissions !== param)
      const res = await postRoleApply(param, id);
      this.$message({ type: 'success', message: '修改成功' });
      this.$router.push({
        path: '/permission/role',
      });
      console.log(res);
    },
  },
};
</script>

<style lang="scss">
.grant{
  .submit {
    margin: 40px auto 20px auto;
    width: 167px;
  }
  h1{
    font-size: 16px;
  }
  .el-tree{
    >.el-tree-node{
      display: block ;
      .el-tree-node__children{
        >.el-tree-node{
          display: block;
          .el-tree-node__children{
            >.el-tree-node{
              display: block;
              .el-tree-node__children{
                >.el-tree-node{
                  display: inline-block;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
