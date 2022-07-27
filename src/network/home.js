import { request } from '@/network/request.js'

export function getMenuList() {
  return request({
    url: 'menus'
  })
}