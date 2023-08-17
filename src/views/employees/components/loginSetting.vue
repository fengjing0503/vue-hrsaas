<template>
  <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="120px" style="margin-left: 120px; margin-top: 30px">
    <el-form-item label="姓名:" prop="username">
      <el-input v-model="userInfo.username" style="width:300px" />
    </el-form-item>
    <el-form-item label="密码:" prop="password">
      <el-input v-model="userInfo.password" type="password" style="width:300px" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="hUpdate">更新</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getUserInfo, updateUserInfoById } from '@/api/user'
export default {
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      const res = await getUserInfo(this.$route.params.id).catch(e => e)
      if (!res.success) return console.log(res.message)
      // console.log(res)
      this.userInfo = res.data
    },
    async hUpdate() {
      const valid = await this.$refs.userForm.validate().catch(e => e)
      if (!valid) return
      const res = await updateUserInfoById(this.userInfo).catch(e => e)
      if (!res.success) this.$message.error(res.message)
      this.$message.success(res.message)
    }
  }
}
</script>

