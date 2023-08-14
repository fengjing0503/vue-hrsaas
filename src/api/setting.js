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
