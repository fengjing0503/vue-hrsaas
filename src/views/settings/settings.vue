<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="hAdd">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="roles">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="hAssgin(scope.row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="hEdit(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="hDel(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <!-- <el-pagination layout="prev,pager,next" /> -->
              <!-- current-page	当前页数 -->
              <!-- page-sizes	每页显示个数选择器的选项设置 -->
              <!-- page-size	每页显示条目个数 -->
              <!-- total	总条目数 -->
              <!-- size-change 当page-size发生改变时触发 -->
              <!-- current-change	currentPage 改变时会触发 -->
              <el-pagination
                :current-page="pageParams.page"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageParams.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="hSizeChange"
                @current-change="hCurrentChange"
              />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 新增弹框 -->
    <el-dialog
      :title="isEdit?'编辑':'新增'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showDialog"
      @close="hClose"
    >
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="showDialog=false">取消</el-button>
          <el-button size="small" type="primary" @click="hSubmit">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog :visible.sync="showDialogAssign">
      <assignPermission v-if="showDialogAssign" :role-id="roleId" @close="showDialogAssign=false" />
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, delrolesById, addRole, editRoleById } from '@/api/setting'
import assignPermission from './assignPermission'
export default {
  components: { assignPermission },
  data() {
    return {
      roleId: '',
      isEdit: false,
      pageParams: {
        page: 1,
        pagesize: 5
      },
      roles: [],
      total: 0,
      showDialog: false,
      showDialogAssign: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    maxNum() {
      return Math.ceil(this.total / this.pageParams.pagesize)
    }
  },
  created() {
    this.loadRoles()
  },
  methods: {
    async loadRoles() {
      try {
        const res = await getRoles(this.pageParams)
        // console.log(res)
        this.roles = res.data.rows
        this.total = res.data.total
      } catch (error) {
        console.log('获取角色信息失败', error)
      }
    },
    hSizeChange(val) {
      // console.log(val)
      this.pageParams.pagesize = val
      this.loadRoles()
    },
    hCurrentChange(val) {
      this.pageParams.page = val
      this.loadRoles()
    },
    async hDel(id) {
      // console.log(id)
      // this.$confirm('确定要删除吗?', '提示', { type: 'warning' }).then(async() => {
      //   try {
      //     const res = await delrolesById(id)
      //     this.$message.success(res.message)
      //     this.loadRoles()
      //   } catch (error) {
      //     this.$message.error(error.message)
      //   }
      // }).catch(() => {})
      const result = await this.$confirm('确定要删除吗?', '提示', { type: 'warning' })
      if (result !== 'confirm') return
      const res = await delrolesById(id).catch(e => { this.$message.error(e.message) })
      this.$message.success(res.message)
      this.loadRoles()
      if (this.roles.length === 1 && this.pageParams.page > 1) {
        this.pageParams.page--
        this.loadRoles()
      }
    },
    hEdit(row) {
      this.showDialog = true
      this.roleForm = { ...row }
      this.isEdit = true
    },
    hAdd() {
      this.showDialog = true
      this.isEdit = false
    },
    async hSubmit() {
      const valid = await this.$refs.roleForm.validate().catch(e => e)
      if (!valid) return
      this.isEdit ? this.doEdit() : this.doAdd()
    },
    async doAdd() {
      const res = await addRole(this.roleForm).catch(e => { this.$message.error(e.message) })
      this.$message.success(res.message)
      if (this.total % this.pageParams.pagesize === 0) {
        this.pageParams.page = this.maxNum + 1
        this.total++
      } else {
        this.pageParams.page = this.maxNum
      }
      this.loadRoles()
      this.showDialog = false
    },
    async doEdit() {
      const res = await editRoleById(this.roleForm).catch(e => { this.$message.error(e.message) })
      this.$message.success(res.message)
      this.loadRoles()
      this.showDialog = false
    },
    hClose() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
    },
    hAssgin(id) {
      this.roleId = id
      this.showDialogAssign = true
    }
  }
}
</script>
