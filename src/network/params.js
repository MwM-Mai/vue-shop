import { request } from './request'

// 获取商品分类数据
export function getcateList() {
  return request({
    url: 'categories',
    method: 'get'
  })
}


// 根据所选分类的id 和当前所处的面板获取对于的参数
export function getCurrentCateId(id, sel) {
  return request({
    url: `categories/${id}/attributes`,
    params: {
      sel
    },
    method: 'get'
  })
}


// 添加动态参数/静态属性
export function addParams(id, attr_name, attr_sel) {
  return request({
    url: `categories/${id}/attributes`,
    data: {
      attr_name,
      attr_sel
    },
    method: 'post'
  })
}


//根据id查询参数
export function getParamsId(id, attr_id, attr_sel) {
  return request({
    url: `categories/${id}/attributes/${attr_id} `,
    params: {
      attr_sel
    },
    method: 'get'
  })
} 


// 提交编辑参数信息
export function editParamsId(id, attr_id, attr_name, attr_sel, attr_vals) {
  return request({
    url: `categories/${id}/attributes/${attr_id}`,
    data: {
      attr_sel,
      attr_name,
      attr_vals
    },
    method: 'put'
  })
}



// 根据 id 删除对应的参数对象
export function removeParamsId(id, attr_id) {
  return request({
    url: `categories/${id}/attributes/${attr_id}`,
    method: 'delete'
  })
}