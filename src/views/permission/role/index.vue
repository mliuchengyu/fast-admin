<template>
  <el-card class="full-height full-width role">
    <MyTables
      ref="myTables"
      :url="url"
      :column-data="columnData"
      :search-show="false"
    >
      <template v-slot:slotBtns>
        <el-button type="primary" @click="status = 1">添加</el-button>
      </template>
    </MyTables>
    <Add v-if="status" :url="url" :status.sync="status" :tableid="tableid" @close-dialog="status = null" @init-table="$refs.myTables.getList()" />
    <!-- <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新建角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="role.slug" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="拥有权限">
          <el-tree
            ref="tree"
            :data="permissionList"
            :default-checked-keys="role.permissions"
            show-checkbox
            node-key="id"
            :props="{children: 'children',label: 'label'}"
          />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="role.description" placeholder="描述" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog> -->
  </el-card>
</template>

<script>
import Add from './add';
export default {
  name: 'Role',
  components: {
    Add
  },
  data() {
    return {
      url: 'roles',
      status: null,
      tableid: null,
      columnData: [
        {
          attr: { type: 'index', width: 50, align: 'center', label: '序号' },
        },
        {
          attr: { prop: 'name', label: '角色名称', },
        },
        {
          attr: { prop: 'slug', label: '角色标识', },
        },
        {
          attr: { prop: 'description', label: '描述', },
        },
        {
          attr: { label: '操作', width: 210 },
          render: row => {
            return (
              <div>
                <el-button type='primary' onClick={() => { this.status = 2; this.tableid = row.id; } }>编辑</el-button>
                <el-button type='primary' onClick={() => {
                  this.$router.push({
                    path: '/permission/grant',
                    query: {
                      id: row.id,
                      permissions: row.permissions,
                    },
                  });
                } }>授权</el-button>
                <el-button type='danger' onClick={() => this.$refs.myTables.delete(row.id)}>删除</el-button>
              </div>
            );
          }
        },
      ],
    };
  },

};
</script>

