<template>
  <div class="employees-container">
    <div class="app-container">
      <page-tools>
        <template #left>
          <span>总记录数: 16 条</span>
        </template>
        <template #right>
          <el-button type="warning" size="small">excel导入</el-button>
          <el-button type="danger" size="small">excel导出</el-button>
          <el-button type="primary" size="small">新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top: 10px;">
        <el-table :data="employees" border>
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column label="聘用形式">
            <template v-slot="{row}">
              {{ formatEmployement( row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" />
          <el-table-column label="账户状态" />
          <el-table-column label="操作" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployees } from '@/api/employess'
import empConstant from '@/constant/employees'
const obj = {}
empConstant.hireType.forEach(item => {
  obj[item.id] = item.value
})
console.log(obj[1])
export default {
  data() {
    return {
      pageParams: {
        page: 1,
        size: 10
      },
      total: 0,
      employees: []
    }
  },
  created() {
    this.loadEmployess()
  },
  methods: {
    async loadEmployess(pageParams) {
      const res = await getEmployees(pageParams).catch(e => console.log('获取员工信息失败', e))
      this.$message.success(res.message)
      this.employees = res.data.rows
      this.total = res.data.total
      console.log(res)
    },
    formatEmployement(code) {
      return obj[code]
    }
  }
}
</script>
