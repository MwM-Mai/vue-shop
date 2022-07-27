import axios from 'axios'

export function request(config) {
     // 1. 创建 axios 实例
  const instance = axios.create({
      baseURL: 'http://127.0.0.1:8888/api/private/v1/',
      timeout: 5000
    })

    // 2. axios 拦截器
    // 2.1 请求拦截的作用
  instance.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 必须return config
    return config 
  })   //  拦截请求 us 两个参数 都是函数 函数本身也有参数

  // 2.2 响应拦截的作用
  instance.interceptors.response.use(res => {

    return res.data
  })  //  拦截响应 也是两个参数
  
    // 3. 发送真正的网络请求
    return instance(config)   // 源码表示 最终的返回值是 Promise
}