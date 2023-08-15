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

export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

export function addEmployee(data) {
  return request({
    url: `/sys/user`,
    method: 'POST',
    data
  })
}

export function importEmployee(data) {
  return request({
    url: `/sys/user/batch`,
    method: 'POST',
    data
  })
}
