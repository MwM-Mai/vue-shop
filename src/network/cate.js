import { request } from "./request"

// 获取 商品列表的数据
export function getCateList(queryInfo) {
  return request({
    url: 'categories',
    params: queryInfo,
    method: 'get'
  })
}

// 获取父级分类的数据列表
export function getParentCateList(type) {
  return request({
    url: 'categories',
    params: {
      type
    },
    method: 'get'
  })
}

// 添加新的商品分类
export function addCate(cat_name, cat_pid, cat_level) {
  return request({
    url: 'categories',
    data: {
      cat_name,
      cat_pid,
      cat_level
    },
    method: 'post'
  })
}

// 获取编辑商品分类 信息
export function getCategoriesInfo(id) {
  return request({
    url: `categories/${id}`,
    method: 'get'
  })
}

// 修改编辑商品分类 信息
export function setCateInfo(id, cat_name) {
  return request({
    url: `categories/${id}`,
    data: {
      cat_name
    },
    method: 'put'
  })
}

// 删除商品分类 信息
export function deleteCateInfo(id) {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  })
}