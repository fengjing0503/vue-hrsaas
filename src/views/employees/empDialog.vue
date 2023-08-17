<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" value-format="yyyy-MM-dd" style="width:50%" placeholder="请选择入职时间" />
    </el-form-item>

    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
        <el-option v-for="item in hireType" :key="item.id" :value="item.id" :label="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
    </el-form-item>

    <el-form-item label="部门" prop="departmentName">
      <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="hFocus()" />

      <el-tree v-if="showTree" empty-text="" :data="treeData" :props="{ label: 'name' }" @node-click="hNodeClick" />

    </el-form-item>

    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <el-button @click="hClose">取消</el-button>
      <el-button type="primary" @click="hSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// 引入api方法
import { getDepartments } from '@/api/departments'
// 引入树形结构转换方法
import { tranListToTreeData } from '@/utils'

import { addEmployee } from '@/api/employess'
import EmployeeEnum from '@/constant/employees'
const hireType = EmployeeEnum.hireType
export default {
  data() {
    return {
      hireType,
      showTree: false,
      treeData: [],
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    // 确定
    async hSubmit() {
      const valid = await this.$refs.addForm.validate()
      if (!valid) return
      this.$emit('hSuccess')
      const res = await addEmployee(this.formData).catch(e => this.$message(e.message))
      //   console.log(res)
      this.$message.success(res.message)
    },
    async loadDepartments() {
      if (this.treeData.length > 0) return
      const res = await getDepartments()
      // console.log(res)
      res.data.depts.shift()
      this.treeData = tranListToTreeData(res.data.depts)
    },
    async hFocus() {
      await this.loadDepartments()
      this.showTree = 'ture'
    },
    hNodeClick(data) {
    //   console.log('用户在部门结构树上点击', data)
      if (data.children.length > 0) return
      this.formData.departmentName = data.name
    },
    // 取消
    hClose() {
      this.$emit('close')
    }
  }
}

</script>
