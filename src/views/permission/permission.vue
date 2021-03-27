<template>
  <el-card class="full-height full-width">
    <div class="operation-panel">
      <div class="search-area">
        <el-input v-model="searchForm.keyword" maxlength="15" style="width:200px;" placeholder="搜索权限名称" />
        <el-button type="primary" class="search-btn" @click="search">
          搜索
        </el-button>
        <el-button type="primary" style="float: right" @click="handleAdd">
          新建权限
        </el-button>
      </div>
    </div>

    <el-table :data="permissionList" row-key="id" lazy :load="load" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="权限名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限标识" width="220">
        <template slot-scope="scope">
          {{ scope.row.slug }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '编辑权限' : '新建权限'">
      <el-form :model="permission" label-width="80px" label-position="left">
        <el-form-item label="权限名称">
          <el-input v-model="permission.name" placeholder="权限名称" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="permission.slug" placeholder="权限名称" />
        </el-form-item>
        <el-form-item label="父级权限">
          <el-cascader v-model="permission.parent_id" :options="permissionOptions" :props="config" clearable />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="permission.description" placeholder="描述" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPermission">确定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { deepClone } from '@/utils';
import {
  getPermissions,
  addPermission,
  updatePermission,
  deletePermission,
  getPermisssionsNodes,
} from '@/api/permission';
import success from '../../utils/operation-message';

const defaultPermission = {
  name: '',
  slug: '',
  parent_id: '',
  description: '',
};

export default {
  data() {
    return {
      permission: Object.assign({}, defaultPermission),
      permissionList: [],
      permissionOptions: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      config: { checkStrictly: true, emitPath: false },
      searchForm: {
        keyword: '',
      },
    };
  },
  computed: {
    routesData() {
      return this.routes;
    },
  },
  created() {
    this.getPermissions();
    this.getPermisssionsNodes();
  },
  methods: {
    async getPermissions() {
      const params = {
        keyword: this.searchForm.keyword,
        parent_id: 0,
      };
      const res = await getPermissions(params);
      this.permissionList = res.data;
    },
    async getPermisssionsNodes() {
      const res = await getPermisssionsNodes();
      this.permissionOptions = res;
    },
    async load(row, treeNode, resolve) {
      const res = await getPermissions({ parent_id: row.id });
      resolve(res.data);
    },
    search() {
      this.getPermissions();
    },
    handleAdd() {
      this.permission = Object.assign({}, deletePermission);
      this.dialogType = 'new';
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = 'edit';
      this.dialogVisible = true;
      this.permission = deepClone(scope.row);
    },
    handleDelete(scope) {
      this.$confirm('您确定要删除该权限吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(
          /*eslint-disable-line */ async () => {
            await deletePermission(scope.row.id);
            this.getPermissions();
            this.$message({
              type: 'success',
              message: '删除成功',
            });
          }
        )
        .catch((err) => {
          console.error(err);
        });
    },
    async confirmPermission() {
      const isEdit = this.dialogType === 'edit';

      if (isEdit) {
        await updatePermission(this.permission, this.permission.id);
      } else {
        await addPermission(this.permission);
      }
      this.getPermissions();
      this.dialogVisible = false;
      success();
    },
  },
};
</script>
