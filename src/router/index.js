import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import("../views/login/Login") // 路由懒加载
const Home = () => import("@/views/home/Home")
const WelCome = () => import('@/components/welcome/Welcom')
const Users = () => import("@/components/users/Users")
const Rights = () => import("@/components/power/Rights")
const Roles = () => import("@/components/power/Roles")
const Cate = () => import("@/components/goods/Cate")
const Params = () => import("@/components/goods/Params")
const List = () => import("@/components/goods/List")
const Add = () => import("@/components/goods/Add")
const Order = () => import("@/components/order/Order")
const Report = () => import("@/components/report/Report")

  
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/Login'
  },
  {
    path: '/Login',
    component: Login
  }, {
    path: '/Home',
    component: Home,
    redirect: '/Welcome',   // 只要访问到home地址 重新定向到 Welcome 子路由
    children: [{
      path: '/Welcome',
      component: WelCome
    }, {
      path: '/Users',
      component: Users
    },{
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/categories',
      component: Cate
    },{
      path: '/params',
      component: Params
    },{
      path: '/goods',
      component: List
    },{
      path: '/add',
      component: Add
    },{
      path: '/orders',
      component: Order 
    },{
      path: '/reports',
      component: Report 
    }
    
      
      
    ]
  }
  
]

const router = new VueRouter({
  routes,
  mode: 'history'
})



// 设置路由导航守卫 实现访问权限  如果用户没有登录 要直接通过URL访问特定网页,需要重新导航到登录页面
// 为路由对象添加beforeEach 导航守卫
// to: 将要跳转的页面
// from: 从哪个页面跳转
// next: 将要放行的函数 两种方式 1. next() 放行到将要跳转的页面   2. next('/Login') 强制跳转到登录界面 
router.beforeEach((to, from, next) => {
  // 如果用户访问登录页面,直接放行
  if (to.path === '/Login') return next()
  // 从 sessionStorage 中获取到 保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果 tokenStr 为空 就是 没有权限访问 特定页面 放行回到 登录界面 
  if (!tokenStr) return next('/Login')
  // 如果 token 有值 放行到将要跳转页面
  next()
})



export default router
