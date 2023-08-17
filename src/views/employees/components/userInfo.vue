<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="220px">
      <!--手机 -->

      <el-form-item label="手机">
        <el-input v-model="userInfo.mobile" disabled style="width:220px" />
      </el-form-item>

      <!-- 工号 入职时间 -->

      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="userInfo.timeOfEntry" type="date" class="inputW" value-format="yyyy-MM-dd" />
      </el-form-item>

      <!-- 员工照片 -->

      <el-form-item label="员工头像">
        <!-- 放置上传图片 -->
        <!-- <img :src="userInfo.staffPhoto"> -->
        <UploadImg v-model="userInfo.staffPhoto" />
      </el-form-item>

      <!-- 保存个人信息 -->
      <el-form-item>
        <el-button type="primary" @click="hUpdate">保存更新</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserInfo, updateUserInfoById } from '@/api/user'
export default {
  data() {
    return {
      userId: this.$route.params.id,
      userInfo: {
        mobile: '',
        timeOfEntry: ''
      },
      rules: {
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      // console.log(this.userId)
      const res = await getUserInfo(this.userId).catch(e => e)
      if (!res.success) return
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

<style scoped lang="scss">
.user-info {
  padding-top: 20px;
}
</style>
