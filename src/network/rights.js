import { request } from "./request"


// 获取 权限列表的数据
export function getRightsList() {
  return request({ 
    url: 'rights/list',
    method: 'get'
  })
}