<template>
  <el-card class="full-height full-width user">
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
      url: 'users',
      status: null,
      tableid: null,
      columnData: [
        {
          attr: { type: 'index', width: 50, align: 'center', label: '序号' },
        },
        {
          attr: { prop: 'username', label: '管理员账号', },
        },
        {
          attr: { prop: 'name', label: '管理员姓名', },
        },
        {
          attr: { prop: 'remark', label: '备注', },
        },
        {
          attr: { label: '操作', width: 180 },
          render: row => {
            return (
              <div>
                <el-button type='primary' onClick={() => { this.status = 2; this.tableid = row.id; } }>编辑</el-button>
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

