import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'user/logout',
    method: 'post'
  })
}

export function refreshToken(data) {
  return request({
    url: '/user/refresh/token',
    method: 'post',
    data
  })
}

export function getUserList(query) {
  return request({
    url: 'user',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: 'user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'user/' + data['id'],
    method: 'put',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: 'user/' + data['id'],
    method: 'delete'
  })
}

export function getRouter() {
  return request({
    url: 'user/menu',
    method: 'get'
  })
}
