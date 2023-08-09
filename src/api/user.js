import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getUserProfile() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

