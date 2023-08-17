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

/**
 * @description: 为用户分配角色
 * @param {*} data { id:当前用户id, roleIds:选中的角色id组成的数组 }
 * @return {*}
 */
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
