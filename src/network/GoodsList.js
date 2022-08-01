import { request } from "./request";


// 获取商品列表数据
export function getGoodsList(query, pagenum, pagesize) {
  return request({
    url: 'goods',
    params: {
      query, 
      pagenum,
      pagesize
    },
    methid: 'get'
  })
}

// 根据id 删除商品
export function deletGoodsById(id) {
  return request({
    url: `goods/${id}`,
    method: 'delete'
  })
}


// 发起添加商品的请求
export function addGoods(form) {
  return request({
    url: 'goods',
    data: form,
    method: 'post'
  })
}