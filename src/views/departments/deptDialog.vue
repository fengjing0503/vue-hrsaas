<template>
  <el-form ref="deptForm" label-width="120px" :model="form" :rules="rules">
    <el-form-item label="部门名称" prop="name">
      <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门编码" prop="code">
      <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门负责人" prop="manager">
      <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
        <el-option v-for="item in employees" :key="item.id" :value="item.username" :label="item.username" />
      </el-select>
    </el-form-item>
    <el-form-item label="部门介绍" prop="introduce">
      <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click="hSubmit">确定</el-button>
      <el-button size="small" @click="hCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getEmployeeSimple } from '@/api/employess'
import { getDepartmentById, updateDepartementById, addDepartments } from '@/api/departments'
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    originList: {
      type: Array,
      required: true
    }
  },
  data() {
    const validCode = (rule, value, callback) => {
      // 根据id找除了自己以外的所有部门
      let codeList = this.originList.map(item => item.code)
      if (this.isEdit) {
        codeList = this.originList.filter(item => item.id !== this.id).map(item => item.code)
      }
      console.log(codeList)
      codeList.includes(value) ? callback(new Error('部门编码' +
      value + '已经存在')) : callback()
    }
    const validName = (rule, value, callback) => {
      let NameList = this.originList.filter(item => item.pid === this.id).map(item => item.name)
      if (this.isEdit) {
        const pid = this.originList.find(item => item.id === this.id).pid
        NameList = this.originList.filter(item => item.pid === pid && item.id !== this.id).map(item => item.name)
      }
      // console.log(NameList)
      NameList.includes(value) ? callback(new Error(value + '已经存在')) : callback()
    }
    return {
      employees: [],
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }

        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.lodaEmployee()
    this.loadDetail()
  },
  methods: {
    async loadDetail() {
      if (!this.isEdit) return
      const res = await getDepartmentById(this.id)
      // console.log('修改的', res)
      this.form = res.data
    },
    hSubmit() {
      this.$refs.deptForm.validate(async valid => {
        try {
          if (!valid) return
          let res = ''
          if (this.isEdit) {
            res = await updateDepartementById(this.form)
            // console.log('修改', res)
          } else {
            res = await addDepartments({ ...this.form, pid: this.id })
            // console.log('增加', res)
          }
          this.$message.success(res.message)
          this.$emit('success')
        } catch (error) {
          this.$message.error(error.message)
        }
      })
    },
    // 取消
    hCancel() {
      this.$emit('close')
    },
    async lodaEmployee() {
      try {
        const res = await getEmployeeSimple()
        // console.log(res)
        this.employees = res.data
      } catch (error) {
        console.log(error)
      }
    }
  }

}
</script>

