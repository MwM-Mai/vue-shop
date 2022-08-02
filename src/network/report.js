import { request } from "./request";

// 获取折线图数据
export function getreport() {
  return request({
    url: 'reports/type/1',
    method: 'get'
  })
}