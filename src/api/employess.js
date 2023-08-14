import request from '@/utils/request'

export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

export function getEmployees(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}
