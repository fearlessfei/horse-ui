import request from '@/utils/request'

export function getLogList(query) {
  return request({
    url: 'log',
    method: 'get',
    params: query
  })
}
