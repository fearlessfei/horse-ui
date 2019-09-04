import request from '@/utils/request'

export function getGroupList(query) {
  return request({
    url: 'group',
    method: 'get',
    params: query
  })
}

export function createGroup(data) {
  return request({
    url: 'group',
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: 'group/' + data['id'],
    method: 'put',
    data
  })
}

export function deleteGroup(groupId) {
  return request({
    url: 'group/' + groupId,
    method: 'delete'
  })
}

export function getGroupUser(groupId) {
  return request({
    url: 'group/user/' + groupId,
    method: 'get'
  })
}

export function updateGroupUser(groupId, data) {
  return request({
    url: 'group/user/' + groupId,
    method: 'put',
    data
  })
}
