import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'GET'
  })
}

export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

export function getDepartmentById(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'GET'
  })
}

export function updateDepartementById(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}

export function delDepartementById(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
