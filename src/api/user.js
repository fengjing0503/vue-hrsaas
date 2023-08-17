import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户基本资料,包含id
export function getProfile() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 获取员工基本信息,传入id,获取头像
export function getUserInfo(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function updateUserInfoById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

