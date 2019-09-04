import request from '@/utils/request'

export function getRoleList(query) {
  return request({
    url: 'role',
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: 'role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: 'role/' + data['id'],
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: 'role/' + data['id'],
    method: 'delete',
    data
  })
}

export function getRoleMenulist(roleId) {
  return request({
    url: 'role/menu/' + roleId,
    method: 'get'
  })
}

export function updateRoleMenu(roleId, data) {
  return request({
    url: 'role/menu/' + roleId,
    method: 'put',
    data
  })
}
