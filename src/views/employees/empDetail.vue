<template>
  <div class="employees-container">
    {{ $route.params.id }}
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <login-setting />
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import LoginSetting from './components/loginSetting'
import UserInfo from './components/userInfo'
import JobInfo from './components/jobInfo'
export default {
  name: 'Detail',
  components: {
    JobInfo, LoginSetting, UserInfo
  }
}

</script>
