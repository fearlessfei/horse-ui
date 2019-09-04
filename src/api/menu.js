import request from '@/utils/request'

export function getMenuList(query) {
  return request({
    url: 'menu',
    method: 'get',
    params: query
  })
}

export function createMenu(data) {
  return request({
    url: 'menu',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: 'menu/' + data['id'],
    method: 'put',
    data
  })
}

export function deleteMenu(menuId) {
  return request({
    url: 'menu/' + menuId,
    method: 'delete'
  })
}

