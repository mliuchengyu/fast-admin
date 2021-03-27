<template>
  <el-card class="full-height full-width">
    <el-button type="primary" @click="handleAdd">新建菜单</el-button>

    <el-table
      :data="menuList"
      row-key="id"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="菜单名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="菜单路径" width="220">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑菜单':'新建菜单'">
      <el-form :model="menu" label-width="80px" label-position="left">
        <el-form-item label="菜单名称">
          <el-input v-model="menu.title" placeholder="菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="menu.path" placeholder="菜单路径" />
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-cascader
            v-model="menu.parent_id"
            :options="menuOptions"
            :props="config"
            clearable
          />
        </el-form-item>
        <el-form-item label="所属角色">
          <el-select v-model="menu.roles" class="selector" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmMenu">确定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { deepClone } from '@/utils';
import { getMenus, addMenu, updateMenu, deleteMenu, getMenuNodes } from '@/api/menu';
import { getRoles } from '@/api/role';
import success from '@/utils/operation-message';

const defaultMenu = {
  title: '',
  path: '',
  parent_id: 0
};

export default {
  data() {
    return {
      menu: Object.assign({}, defaultMenu),
      menuList: [],
      roleList: [],
      menuOptions: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      config: { checkStrictly: true, emitPath: false }
    };
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  created() {
    this.getMenus();
    this.getRoles();
    this.getMenuNodes();
  },
  methods: {
    async getMenus() {
      this.menuList = [];
      const res = await getMenus({ parent_id: 0 });
      this.menuList = res.data;
    },
    async load(row, treeNode, resolve) {
      const res = await getMenus({ parent_id: row.id });
      resolve(res.data);
    },
    async getMenuNodes() {
      const res = await getMenuNodes();
      this.menuOptions = res;
    },
    async getRoles() {
      const res = await getRoles();
      this.roleList = res.data;
    },
    handleAdd() {
      this.menu = Object.assign({}, deleteMenu);
      this.dialogType = 'new';
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = 'edit';
      this.dialogVisible = true;
      this.menu = deepClone(scope.row);
    },
    handleDelete(scope) {
      this.$confirm('您确定要删除该菜单吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteMenu(scope.row.id);
          this.getMenus();
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        })
        .catch(err => { console.error(err); });
    },
    async confirmMenu() {
      const isEdit = this.dialogType === 'edit';

      if (isEdit) {
        await updateMenu(this.menu, this.menu.id);
      } else {
        await addMenu(this.menu);
      }
      this.getMenus();
      this.getMenuNodes();

      this.dialogVisible = false;
      success();
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
