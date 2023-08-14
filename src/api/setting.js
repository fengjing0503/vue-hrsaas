import request from '@/utils/request'

export function getRoles(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

export function delrolesById(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}

export function addRole(data) {
  return request({
    url: `/sys/role`,
    method: 'POST',
    data
  })
}

export function editRoleById(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}
