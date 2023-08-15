<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <svg-icon icon-class="gs" /><span> xxxxx有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <!-- 下拉菜单 element -->
              <el-col>
                <el-dropdown>
                  <span>
                    操作<i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="hShowAdd('')">添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <!-- 树形组件 -->
        <!-- default-expand-all  默认展开所有子节点 -->
        <el-tree :data="list" default-expand-all>
          <template v-slot="{data}">

            <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%;">
              <el-col :span="20">
                <span>{{ data.name }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager }}</el-col>
                  <!-- 下拉菜单 element -->
                  <el-col>
                    <el-dropdown>
                      <span>
                        操作<i class="el-icon-arrow-down" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="hShowAdd(data.id)">添加子部门</el-dropdown-item>
                        <el-dropdown-item @click.native="hShowEdit(data.id)">修改部门</el-dropdown-item>
                        <el-dropdown-item v-if="data.children.length===0" @click.native="hDel(data.id)">删除部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </el-card>
    </div>
    <el-dialog
      title="添加"
      :visible.sync="showDialog"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <addor-edit v-if="showDialog" :id="curId" :is-edit="isEdit" :origin-list="originList" @success="hSuccess" @close="hclose" />
    </el-dialog>
    <el-dialog
      title="修改"
      :visible.sync="showDialogEdit"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <addor-edit v-if="showDialogEdit" :id="curId" :is-edit="isEdit" :origin-list="originList" @success="hSuccess" @close="hclose" />
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments, delDepartementById } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddorEdit from './deptDialog.vue'
export default {
  components: {
    AddorEdit
  },
  data() {
    return {
      showDialog: false,
      showDialogEdit: false,
      isEdit: false,
      // 依赖一份树形数据
      list: [{
        name: '财务部',
        manager: '刘备',
        children: [
          {
            name: '财务核算部',
            manager: '张飞'
          },
          {
            name: '税务核算部',
            manager: '关羽'
          }
        ]
      }],
      curId: '',
      originList: []
    }
  },
  created() {
    this.loadDepartments()
  },
  methods: {
    async loadDepartments() {
      try {
        const res = await getDepartments()
        console.log(res)
        res.data.depts.shift()
        // console.log('loadDepartments', company)
        this.originList = res.data.depts.map(({ id, pid, code, name }) => ({ id, name, code, pid }))
        console.log(this.originList)
        this.list = tranListToTreeData(res.data.depts)
      } catch (error) {
        console.log(error)
      }
    },
    // 添加
    hShowAdd(id) {
      this.showDialog = true
      this.curId = id
      this.isEdit = false
    },
    // 编辑
    hShowEdit(id) {
      this.showDialogEdit = true
      this.curId = id
      this.isEdit = true
    },
    hSuccess() {
      this.showDialog = false
      this.showDialogEdit = false
      this.loadDepartments()
    },
    hclose() {
      this.showDialog = false
      this.showDialogEdit = false
    },
    async doDel(id) {
      try {
        const res = await delDepartementById(id)
        console.log(res)
        this.loadDepartments()
        this.$message.success(res.message)
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    // 点删除
    hDel(id) {
      this.$confirm('此操作将永久删除部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 做删除
        this.doDel(id)
      }).catch(() => {

      })
    }
  }
}
</script>
