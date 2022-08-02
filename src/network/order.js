import { request } from "./request";

// 获取订单列表的数据
export function getOrderList(orderList) {
  return request({
    url: 'orders',
    params: orderList,
    method: 'get'
  })
}


// 查看物流信息
export function getprogress() {
  return request({
    url: `/kuaidi/1106975712662`,
    method: 'get'
  })
}