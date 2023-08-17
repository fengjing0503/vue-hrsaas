<template>
  <div class="employees-container">
    <div class="app-container">
      <page-tools>
        <template #left>
          <span>总记录数: 16 条</span>
        </template>
        <template #right>
          <el-button v-allow="'import_Excel'" type="warning" size="small" @click="$router.push('/employees/import')">excel导入</el-button>
          <el-button v-allow="'export_Excel'" type="danger" size="small" @click="hExport">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top: 10px;">
        <el-table :data="employees" border>
          <el-table-column label="序号" type="index" />
          <el-table-column width="70px" label="头像">
            <template v-slot="{row}">
              <image-holder :src="row.staffPhoto" />
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column label="聘用形式">
            <template v-slot="{row}">
              {{ formatEmployement( row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column sortable label="入职时间" prop="timeOfEntry" />
          <el-table-column label="账户状态" />
          <el-table-column label="操作" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small" @click="hAssignRole(row)">分配角色</el-button>
              <el-button v-allow="'delete_employees'" type="text" size="small" @click="hDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :current-page="pageParams.page"
            :page-sizes="[10,15,30,50]"
            :page-size="pageParams.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="hSizeChange"
            @current-change="hCurrentChange"
          />
        </el-row>
      </el-card>
    </div>
    <el-dialog title="新增员工" :visible.sync="showDialog">
      <addor-edit v-if="showDialog" @close="hClose" @hSuccess="hSuccess" />
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="showDialogRole">
      <AssignRole ref="assignRole" :user-id="userId" @close="showDialogRole = false" />
    </el-dialog>
  </div>
</template>

<script>
import addorEdit from './empDialog.vue'
import { delEmployee, getEmployees } from '@/api/employess'
import empConstant from '@/constant/employees'
import AssignRole from './assignRole'
// forEach写法
// const hireMap = {}
// empConstant.hireType.forEach(item => {
//   hireMap[item.id] = item.value
// })
// reduce写法
const hireMap = empConstant.hireType.reduce((hireMap, item) => ({ ...hireMap, [item.id]: item.value }), {})
export default {
  components: {
    addorEdit, AssignRole
  },
  data() {
    return {
      pageParams: {
        page: 1,
        size: 10
      },
      total: 0,
      employees: [],
      showDialogRole: false,
      showDialog: false,
      userId: ''
    }
  },
  created() {
    this.loadEmployess()
  },
  methods: {
    async loadEmployess(pageParams) {
      const res = await getEmployees(this.pageParams).catch(e => console.log('获取员工信息失败', e))
      // this.$message.success(res.message)
      this.employees = res.data.rows
      this.total = res.data.total
      // console.log(res)
    },
    formatEmployement(code) {
      return hireMap[code]
    },
    hSizeChange(val) {
      // console.log(val)
      this.pageParams.size = val
      this.loadEmployess()
    },
    hCurrentChange(val) {
      this.pageParams.page = val
      this.loadEmployess()
    },
    // 删除
    async hDel(id) {
      const result = await this.$confirm('确定删除吗', '提示', { type: 'warning' })
      if (!result) return
      const res = await delEmployee(id).catch(e => this.$message(e.message))
      this.$message.success(res.message)
      this.loadEmployess()
      if (this.employees.length === 1 && this.pageParams.page > 1) {
        this.pageParams.page--
        this.loadEmployess()
      }
    },
    // 取消
    hClose() {
      this.showDialog = false
    },
    // 新增
    hSuccess() {
      this.showDialog = false
      this.total++
      this.pageParams.page = Math.ceil(this.total / this.pageParams.size)
      this.loadEmployess()
    },
    // 导出Excel
    async hExport() {
      const excel = await import('@/vendor/Export2Excel')
      // excel表示导入的模块对象
      // console.log(excel)
      // 发请求拿数据
      const res = await getEmployees({ page: 1, size: this.total }).catch(e => e)
      if (!res.success) return console.dir(res.message)
      // console.log(res)
      // 数据转格式
      const { header, data } = this.format2Excel(res.data.rows)
      // 导出Excel
      excel.export_json_to_excel({
        header, // 表头 必填
        data, // 具体数据 必填
        filename: 'excel-list', // 文件名称
        autoWidth: true, // 宽度是否自适应
        bookType: 'xlsx' // 生成的文件类型
      })
    },
    format2Excel(list) {
      const mapInfo = {
        'id': '编号',
        'password': '密码',
        'mobile': '手机号',
        'username': '姓名',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门',
        'staffPhoto': '头像地址'
      }
      let header = []
      let data = []

      if (list.length === 0) return { header, data }

      const obj = list[0]
      header = Object.keys(obj).map(k => mapInfo[k])

      data = list.map(item => {
        const k = item.formOfEmployment
        item.formOfEmployment = hireMap[k]
        return Object.values(item)
      })

      return { header, data }
    },
    // 点击分配权限
    async hAssignRole({ id }) {
      // console.log('当前要分配角色id是', id)
      this.showDialogRole = true
      this.userId = id

      await this.$nextTick()
      this.$refs.assignRole.lodaRolesById()
    }
  }
}
</script>
